// content.js
/*
Runs in the context of the web page.
Directly interacts with the DOM (Document Object Model) of the page.
Handles tasks like displaying popups, modifying the page, or fetching data.
*/

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "findMeaning") {
      const selectedText = message.text.trim();
      if (selectedText) {
        // Show a temporary loading bubble
        showDefinitionPopup(`Looking up: "${selectedText}"`);
  
        // TODO: Hook to dictionary API here
        // For now just simulate result
        setTimeout(() => {
          showDefinitionPopup(`Definition of "${selectedText}":\n[Mock definition here]`);
        }, 1000);
      }
    }
  });
  
  function showDefinitionPopup(content) {
    removeExistingPopup();
  
    const popup = document.createElement("div");
    popup.id = "wmd-popup";
    popup.innerText = content;
  
    Object.assign(popup.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      background: "#fff",
      color: "#000",
      padding: "12px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      zIndex: "999999",
      maxWidth: "300px",
      fontSize: "14px",
      whiteSpace: "pre-wrap"
    });
  
    document.body.appendChild(popup);
  
    setTimeout(() => {
      popup.remove();
    }, 6000);
  }
  
  function removeExistingPopup() {
    const existing = document.getElementById("wmd-popup");
    if (existing) existing.remove();
  }
  