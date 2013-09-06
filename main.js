var cache = {};
function serialize(obj) {
    var str = [];
    for(var p in obj) {
        var k = p;
        var v = obj[p];
        str.push(
          v instanceof Array ?
            k + "=" + v.join("&" + k +"=") :
              typeof v == "object" ? 
                serialize(v) : 
              encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
    return str.join("&");
}

function buildUrl(url) {
  var fetchUrl = "https://www.googleapis.com/pagespeedonline/v1/runPagespeed";
  var parameters = {
    key: "AIzaSyDGyUTorf9U60Md_ivRQi7bNlIPugQ3dls",
    strategy: "mobile",
    screenshot: "true",
    rule: ["AvoidLandingPageRedirects", "ServerResponseTime" , "MinimizeRenderBlockingResources", "PrioritizeVisibleContent", "EnableGzipCompression", "InlineRenderBlockingCss", "PreferAsyncResources"],
    url: encodeURI(url),
  };
  
  var options = {};
  
  return fetchUrl + "?" + serialize(parameters);
}

var checkPage = function(tabId) {
  var score = 0;
  tabId = tabId.tabId || tabId;
  
  chrome.tabs.get(tabId, function(t) {
    var url = t.url;
    if(url.substring(0,4) != "http") return;
    if(tabId in cache && cache[tabId].response.request.url == t.url) return;

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var score = "";
      var color = [0, 255, 0, 255];
      var html = "";
      var response = JSON.parse(xhr.responseText);
      if(!!response.error === true) {
        score = "!";
        color = [255, 0, 0, 255];
        html = ""
      }
      else {
        score = response.score + "";
        if(response.score >= 85) {
          color = [0, 255, 0, 255];
        }
        else if(response.score >= 50) {
          color = "#FFA500";
        }
        else {
          color = [255, 0, 0, 255];
        } 
 
        cache[tabId] = {
          "response": response,
          "screenshot": "data:" + response.screenshot.mime_type  + ";base64," + response.screenshot.data.replace(/_/g, "/").replace(/-/g, "+")
        }
      }

      chrome.browserAction.setPopup({ "popup": "popup.html", "tabId": tabId });
      chrome.browserAction.setBadgeBackgroundColor({ "color": color, "tabId": tabId});
      chrome.browserAction.setBadgeText({ "text": score, "tabId": tabId });
    };

    xhr.open("GET", buildUrl(url));
    xhr.send();
  });
};

var removePage = function(t) {
  delete cache[t];
};

chrome.tabs.onActivated.addListener(checkPage);
chrome.tabs.onUpdated.addListener(checkPage);
chrome.tabs.onRemoved.addListener(removePage);
