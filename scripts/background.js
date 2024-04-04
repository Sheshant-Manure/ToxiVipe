chrome.tabs.onUpdated.addListener((tabId, tab)=>{
    if(tab.url && tab.url.includes('twitter.com')) 
        console.log(tabId)
})

// Define the function to send the message to content.js
const initiateCheckToxicity = (msg) => {
    // Query for active tab and send the message to content.js
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          const tabId = tabs[0].id;
          chrome.tabs.sendMessage(tabId, { action: msg });
        } 
      });
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Call initiateCheckToxicity with the action from the received message
    console.log(message.action)
    if(message.action === 'checkToxicity')
      initiateCheckToxicity(message.action);

    if(message.action === 'toxicityResponse') {
      chrome.runtime.sendMessage(message);
    }
    
    // Respond to confirm that background.js is working
    sendResponse({ message: 'background.js working' });
});
