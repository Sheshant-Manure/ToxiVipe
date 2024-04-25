(function () {
    let tweet;
    let APIendpoint = 'https://toxivipe.onrender.com/chatgpt/classify-toxicity';
    let data = {
      "statement": ""
    };
    let nonToxicStatement = [];
  
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

    const checkToxicity = async () => {
      if(nonToxicStatement.includes(data.statement)) return console.log('Post has been modified with a suggested non-toxic statement');
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
            const newDiv = document.createElement('div');
            // const toxicWordsDiv = document.createElement('div');
            // toxicWordsDiv.style.display = 'flex';
            // toxicity["toxic words"].forEach((word)=>{
            //   const p = document.createElement('p');
            //   p.style.backgroundColor = 'red';
            //   p.style.fontSize = '14px';
            //   p.style.padding = '5px';
            //   p.style.margin = '5px';
            //   p.textContent = word;
            //   toxicWordsDiv.appendChild(p);
            // })
            // newDiv.appendChild(toxicWordsDiv);

            // Get the toxic words from the toxicity object
            const toxicWords = toxicity["toxic words"];
            let tweetText = tweet.textContent;
            toxicWords.forEach(toxicWord => {
                const regex = new RegExp('\\b' + toxicWord + '\\b', 'gi');
                tweetText = tweetText.replace(regex, `<span style="background-color: yellow;">$&</span>`);
            });
            tweet.innerHTML = tweetText;
            newDiv.id = 'suggestions';
            newDiv.style.width = '100%';
            newDiv.style.display = 'flex';
            newDiv.style.marginTop = '5px';
            newDiv.style.justifyContent = 'center';
            newDiv.style.alignItems = 'center';
            newDiv.style.minHeight = '50px';
            newDiv.style.backgroundColor = 'white';
            tweet.parentNode.insertBefore(newDiv, tweet.nextSibling);
            nonToxicStatement = toxicity['non-toxic statement'];
            nonToxicStatement.forEach((statement)=>{
              const p = document.createElement('p');
              p.textContent = statement;
              p.style.fontSize = '12px';
              p.style.textAlign = 'center';
              p.style.color = 'black';
              p.style.cursor = 'pointer';
              p.onclick = () => {
                tweet.textContent = statement;
                tweet.style.backgroundColor = 'green'
              }
              newDiv.appendChild(p);
            })
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
  