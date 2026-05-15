const http = require("node:http");
const express = require("express");
const { createBareServer } = require("@tomphttp/bare-server-node");
const path = require("path");

const app = express();

// Statik dosyaları sun
app.use(express.static(path.join(__dirname, ".")));

// Proxy server
const bareServer = createBareServer("/bare/");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Proxy route
app.all("/bare/*", (req, res, next) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    next();
  }
});

// Diğer tüm istekler 404
app.use((req, res) => {
  res.status(404).send("Not found.");
});

const server = http.createServer(app);

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port " + (process.env.PORT || 3000));
});
