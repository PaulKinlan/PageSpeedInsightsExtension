var bg = chrome.extension.getBackgroundPage();
chrome.tabs.query({ "currentWindow": true, "active": true }, function(t) {
   var cache = bg.cache[t[0].id];
   var imgSrc = cache.screenshot;
   output.src = imgSrc;

   var htmlresponse = document.getElementById("htmlresponse");
   var jsresponse = document.getElementById("jsresponse");
   var cssresponse = document.getElementById("cssresponse");
   var imageresponse = document.getElementById("imageresponse");
   var insights = document.getElementById("insights");
   
   htmlresponse.innerText = cache.response.pageStats.htmlResponseBytes;
   cssresponse.innerText = cache.response.pageStats.cssResponseBytes;
   jsresponse.innerText = cache.response.pageStats.javascriptResponseBytes;
   imageresponse.innerText = cache.response.pageStats.imageResponseBytes;

   var results = cache.response.formattedResults.ruleResults;
   for(var i in results) {
     var result = results[i];
     if(result.ruleImpact != 0) {
       var row = insights.insertRow(-1);
       var cell1 = row.insertCell(-1);
       cell1.innerHTML = result.localizedRuleName;  
       //insights.appendChild();
     }
   }
});


var loadPage = function() {
  chrome.tabs.query({ currentWindow: true, active: true }, function(t) {
    var url = t[0].url;
    var pagespeedurl = "https://developers.google.com/speed/pagespeed/insights/?url=" + encodeURIComponent(url);
    chrome.tabs.update(t.id, { url: pagespeedurl } );
  });
}

output.onclick = loadPage;
