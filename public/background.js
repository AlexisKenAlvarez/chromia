/* eslint-disable no-undef */
//for sending a message
chrome.runtime.onStartup.addListener(function (e) {
  console.log("Result from tab ", e);
  chrome.tabs.create({ url: "index.html" });
});
