// function getRemoteBody() {
//   const remoteBody = document.body; // Get the body content
//   console.log('Received body and sending REMOTE_BODY message (contentScript)');
//   chrome.runtime.sendMessage({ type: 'REMOTE_BODY', body: remoteBody });
// }

// // Add event listener for click events
// document.addEventListener('click', handleClick);

// // Initial call to get the body content
// getRemoteBody();