// background.js
// Acts as the "brain" of the Chrome Extension.
// Runs in the background and listens for events (e.g., installation, context menu clicks).
// Handles logic that doesn't directly interact with the web page.

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "lookupMeaning",
    title: "Find Meaning",
    contexts: ["selection"], // Show this menu item only when text is selected
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log("Context menu clicked!", info, tab);
  if (info.menuItemId === "lookupMeaning") {
    // Inject content script first
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ["content.js"], // Ensure this path is correct
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error("Error injecting content script:", chrome.runtime.lastError.message);
        } else {
          console.log("Content script injected successfully.");
          // Send message to content script
          chrome.tabs.sendMessage(
            tab.id,
            {
              action: "findMeaning",
              text: info.selectionText, // Pass the selected text
            },
            (response) => {
              if (chrome.runtime.lastError) {
                console.error("Error sending message:", chrome.runtime.lastError.message);
              } else {
                console.log("Message sent successfully. Response:", response);
              }
            }
          );
        }
      }
    );
  }
});