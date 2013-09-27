window.onload = function() {
  apikey.value = localStorage["apikey"] || "";
  apikey.onchange = function(e) {
    localStorage["apikey"] = apikey.value;
  }

  var save = document.getElementById("save");
  if (!!save === true) {
    save.onclick = function() {
      chrome.tabs.query({ "currentWindow": true, "active": true }, function(t) {
        // clear all the cache
        bg.cache = {};
        window.close();
      });
    };
  }
};
