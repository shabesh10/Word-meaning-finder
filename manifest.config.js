export default {
    name: "Word Meaning Detective",
    version: "1.0.0",
    manifest_version: 3,
    description: "Right-click or select any word to see its meaning instantly.",
    permissions: ["contextMenus", "scripting", "tabs", "activeTab"],
    // context menu is the menu we get when u right click on browser's webpage
    host_permissions: ["<all_urls>"],
    background: {
      service_worker: "background.js"
    },
    action: {
      default_popup: "popup.html",
      default_icon: "icon.png"
    },
    content_scripts: [
      {
        matches: ["<all_urls>"],
        js: ["content.js"]
      }
    ],
    icons: {
      "16": "icon.png",
      "48": "icon.png",
      "128": "icon.png"
    }
  };
  
  // this is a json file which contains the metadata of the extension and it is necesary!
  // its usually a json object/file but here we are treating it as a js module..