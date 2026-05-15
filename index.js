const http = require("node:http");
const express = require("express");
const path = require("path");
const { createBareServer } = require("@tomphttp/bare-server-node");

const app = express();

// 1. Statik dosyaları ROOT'tan sun
app.use(express.static(path.join(__dirname)));

// 2. Index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 3. Bare proxy
const bareServer = createBareServer("/bare/");

app.all("*", (req, res, next) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    next();
  }
});

// 4. 404
app.use((req, res) => {
  res.status(404).send("Not found");
});

const server = http.createServer(app);

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
