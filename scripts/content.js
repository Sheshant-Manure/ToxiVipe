(function () {
    let tweet;
    let APIendpoint = 'https://toxivipe.onrender.com/chatgpt/classify-toxicity';
    let data = {
      "statement": ""
    };
  
    // The twitter DOM tree takes few seconds to load completely. Therefore, we wait for 7 seconds to select the tweet text
    setTimeout(() => {
      tweet = document.querySelector('.public-DraftStyleDefault-block');
  
      // Add listener for DOM changes (optional for efficiency)
      tweet.addEventListener("DOMSubtreeModified", () => {
        let text = tweet.textContent || tweet.innerText;
        data.statement = text;
      });
    }, 7000);
  
    const checkToxicity = async () => {
      console.log('checking toxicity for: ', data.statement);
      try {
        const response = await fetch(APIendpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        if (response.ok) {
          const toxicity = await response.json();
          console.log(toxicity);
          chrome.runtime.sendMessage({action: 'toxicityResponse', data: toxicity})
          // You can further process the toxicity data here (e.g., highlight the tweet)
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'checkToxicity') {
        checkToxicity();
      }
      // You can respond back to background script if needed (optional)
    });
  })();
  