chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'REMOTE_BODY' || message.type === 'SELECTED_ELEMENT') {
    console.log('Received REMOTE BODY and sending UPDATE_POPUP:', message.body);
    chrome.runtime.sendMessage({ type: 'UPDATE_POPUP', body: message.body });
  } 
  sendResponse({ status: 'Message received' });
});