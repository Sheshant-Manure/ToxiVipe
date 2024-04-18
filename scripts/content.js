(function () {
    let tweet;
    let APIendpoint = 'https://toxivipe.onrender.com/chatgpt/classify-toxicity';
    let data = {
      "statement": ""
    };
    let nonToxicStatement;
  
    // The twitter DOM tree takes few seconds to load completely. Therefore, we wait for 7 seconds to select the tweet text
    let typingTimer;
    setTimeout(() => {
      tweet = document.querySelector('.public-DraftStyleDefault-block');
      
      // Add listener for DOM changes (optional for efficiency)
      tweet.addEventListener("DOMSubtreeModified", () => {
        let text = tweet.textContent || tweet.innerText;
        data.statement = text;
        if(data.statement === nonToxicStatement) {
          tweet.style.backgroundColor = "green";
        }
        else if(data.statement === ""){
          tweet.style.backgroundColor = "transparent";
        }
        clearTimeout(typingTimer);
        typingTimer = setTimeout(()=>{
            if(data.statement.length > 1 && data.statement !== nonToxicStatement){
              checkToxicity();
            }
          }, 5000);
        })
      }, 5000);

      function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('Text copied to clipboard:', text);
            })
            .catch(err => {
                console.error('Failed to copy text to clipboard:', err);
            });
    }    

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
          if(toxicity.class === "toxic"){
            tweet.style.backgroundColor = "red";
            alert("This statement contains potentially harmful language.");
            nonToxicStatement = toxicity['non-toxic statement'];
            copyToClipboard(nonToxicStatement);
          }
          else {
            tweet.style.backgroundColor = "green";
          }
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
  