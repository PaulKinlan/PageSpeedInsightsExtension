var bg = chrome.extension.getBackgroundPage();
chrome.tabs.query({ "currentWindow": true, "active": true }, function(t) {
   var cache = bg.cache[t[0].id];
   var imgSrc = cache.screenshot;
   output.src = imgSrc;
   
   var detailed = document.getElementById("detailedinsights");
   var htmlresponse = document.getElementById("htmlresponse");
   var jsresponse = document.getElementById("jsresponse");
   var cssresponse = document.getElementById("cssresponse");
   var imageresponse = document.getElementById("imageresponse");
   var insights = document.getElementById("insights");
  
   detailed.href= "https://developers.google.com/speed/pagespeed/insights/?url=" + encodeURIComponent(t[0].id) + "&utm_source=checkerextension";
   htmlresponse.innerText = cache.response.pageStats.htmlResponseBytes + " bytes";
   cssresponse.innerText = cache.response.pageStats.cssResponseBytes + " bytes";
   jsresponse.innerText = cache.response.pageStats.javascriptResponseBytes + " bytes";
   imageresponse.innerText = cache.response.pageStats.imageResponseBytes + " bytes";

   var results = cache.response.formattedResults.ruleResults;
   for(var i in results) {
     var result = results[i];
     if(result.ruleImpact != 0) {
       var liEl = document.createElement("li");
       liEl.innerText = result.localizedRuleName; 
       insights.appendChild(liEl);
     }
   }
});


var loadPage = function() {
  chrome.tabs.query({ currentWindow: true, active: true }, function(t) {
    var url = t[0].url;
    var pagespeedurl = "https://developers.google.com/speed/pagespeed/insights/?url=" + encodeURIComponent(url) + "&utm_source=checkerextension" ;
    chrome.tabs.update(t.id, { url: pagespeedurl } );
  });
}

output.onclick = loadPage;
