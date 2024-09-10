import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState('')
  // const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  // Function to get the remote body content
  function getRemoteBody() {
    const body = document.body.innerHTML
    chrome.runtime.sendMessage({ type: 'REMOTE_BODY', body: body });
  }

  function getSelectedText() {
    const selection = window.getSelection()?.toString();
    chrome.runtime.sendMessage({ type: 'SELECTED_ELEMENT', body: selection });
  }

  const getSummary = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: getRemoteBody
    });
  };

  const getPartialSummary = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: getSelectedText
    });
  };

  const generateSummary = async (body: string) => {
    try {
      let prompt = `Summarize the content of the following HTML in 50 words or less: ${body}`;
      setIsLoading(true);

      const response = await fetch('http://localhost:3000/get-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSummary(data.message.content);
    }
    catch(error) {
      console.error('Error generating summary:', error);
    }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleMessage = (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
      if (message.type === 'UPDATE_POPUP') {
        console.log('Message received (app):', message.body);
        console.log(`Message received in App.tsx from ${sender.id} at ${new Date().toISOString()}`);
        sendResponse({ response: `Message received in App.tsx from ${sender.id}` });
        generateSummary(message.body);
      } else {
        console.log('Unhandled message type:', message.type);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    // Cleanup listener on component unmount
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return (
    <>
      <div className="card p-2 d-flex justify-content-center">
        <h1>Tom's AI Summary extension</h1>
        <h2>Generate Summary</h2>
        <p> Click the button below to generate a summary of the current page.</p>
        <div>
          {!isLoading ? <div className='d-flex justify-content-between align-items-center'> 
            <button className="btn" onClick={getSummary}>Get Summary of full page</button>
            <button className="btn" onClick={getPartialSummary}>Get Summary of selected text</button>
          </div>
          : <div> Loading... </div> }
        </div>
        {summary ? (
          <div>
            <h2>Summary:</h2>
            <div id="summary"> {summary} </div>
          </div> 
        ) : null }
      </div>
    </>
  );
}

export default App;