document.getElementById("searchbox").addEventListener("submit", function(e) {
    e.preventDefault();
    var searchInput = document.getElementById("search").value;
    var searchEngine = document.getElementById("searchengine").value;
    
    if (!searchInput) return;
    
    // Önce URL'yi oluştur
    var url = search(searchInput, searchEngine);
    
    if (url) {
        // Proxy prefix'i ekle: /service/ + URL
        var proxiedUrl = "/service/" + btoa(url);
        window.location.href = proxiedUrl;
    }
});
