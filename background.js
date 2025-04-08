// background.js
// Acts as the "brain" of the Chrome Extension.
// Runs in the background and listens for events (e.g., installation, context menu clicks).
// Handles logic that doesn't directly interact with the web page.

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "lookupMeaning",
      title: "Find Meaning",
      contexts: ["selection"],
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "lookupMeaning") {
      // Inject content script first
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      }, () => {
        // Then send message
        chrome.tabs.sendMessage(tab.id, {
          action: "findMeaning",
          text: info.selectionText
        });
      });
    }
  });
  
  