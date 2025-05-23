/*
Runs in the context of the web page.
Directly interacts with the DOM (Document Object Model) of the page.
Handles tasks like displaying popups, modifying the page, or fetching data.
*/

console.log("📦 content.js loaded!");

let fetchDefinition = async (word) => {
  try {
    let response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    let data = await response.json();
    console.log(data);
    return data;
  } catch (e) {
    console.error("Error fetching definition:", e);
    return null;
  }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in content script:", message);

  if (message.action === "findMeaning") {
    const selectedText = message.text.trim().toLowerCase();
    if (selectedText) {
      // Show a temporary loading bubble
      showDefinitionPopup(`Looking up: "${selectedText}"`);
      fetchDefinition(selectedText).then((data) => {
        if (data && data[0] && data[0].meanings) {
          let [json_obj] = data;
          let { meanings } = json_obj;
          let [idx_0,idx_1,idx_2] = meanings;
          let { definitions } = idx_0;
          let [{ definition }] = definitions;
          // console.log(definition);
          let example1 =
            idx_0?.definitions?.[0]?.example
          // console.log(example);
          let example2 = idx_1?.definitions?.[0]?.example
          let example3 = idx_2?.definitions?.[0]?.example
          let example = example1.length != 0 ? example1 : (example2.length != 0 ? example2 : (example3.length != 0 ? example3 : "Example not available."))
          showDefinitionPopup(
            `Definition of "${selectedText}": ${definition}\nExample: ${example}`
          );
        } else {
          showDefinitionPopup(`No definition found for "${selectedText}".`);
        }
      });
      sendResponse({ status: "success", text: selectedText });
    } else {
      sendResponse({ status: "error", message: "No text selected" });
    }
  }

  // Return true to indicate that the response will be sent asynchronously
  return true;
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
    whiteSpace: "pre-wrap",
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
