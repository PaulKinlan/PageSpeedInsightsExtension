window.onload = function() {
  apikey.value = localStorage["apikey"] || "";
  apikey.onchange = function(e) {
    localStorage["apikey"] = apikey.value;
  }
};
