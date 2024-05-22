(function () {
    let tweet;
    let APIendpoint = 'https://toxivipe.onrender.com/chatgpt/classify-toxicity';
    let data = {
      "statement": ""
    };
    let nonToxicStatement = [];
    let shouldCheck = true
  
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
              shouldCheck = true;
            }
          }, 5000);
        })
      }, 5000);

    const checkToxicity = async () => {
      if(!shouldCheck) return; 
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
          const element = document.querySelector(".css-175oi2r.r-1igl3o0.r-qklmqi.r-1w6e6rj.r-htfu76.r-13qz1uu.r-1awozwy.r-18u37iz.r-1wtj0ep");
          if(toxicity.class === "toxic"){
            shouldCheck = false;
            tweet.style.backgroundColor = "red";
            alert("This statement contains potentially harmful language.");
            const newDiv = document.createElement('div');
            tweet.style.backgroundColor = 'red';
            newDiv.style.width = '100%';
            newDiv.style.display = 'flex';
            newDiv.style.margin = '10px';
            newDiv.style.justifyContent = 'center';
            newDiv.style.alignItems = 'center';
            newDiv.style.minHeight = '50px';
            newDiv.style.backgroundColor = 'white';
            element.parentNode.insertBefore(newDiv, element.nextSibling);
            nonToxicStatement = toxicity['non-toxic statement'];
            nonToxicStatement.forEach((statement)=>{
              const p = document.createElement('p');
              p.textContent = statement;
              p.style.fontSize = '18px';
              p.style.textAlign = 'center';
              p.style.color = 'black';
              p.style.cursor = 'pointer';
              p.style.padding = '5px';
              p.style.margin = '5px';
              p.onclick = () => {
                tweet.textContent = statement;
                tweet.style.backgroundColor = 'green'
              }
              newDiv.appendChild(p);
            })
            const toxicWords = toxicity["toxic words"];
            const div = document.createElement('div');
            div.style.margin = '5px';
            toxicWords.forEach((word) => {
              const spanElement = document.createElement('span');
              spanElement.textContent = ` ${word} `;
              spanElement.style.padding = '5px';
              spanElement.style.margin = '5px';
              spanElement.style.backgroundColor = 'red';
              spanElement.style.fontSize = '18px';
              div.appendChild(spanElement);
            });
            element.parentNode.insertBefore(div, element.nextSibling);
          }
          else {
            tweet.style.backgroundColor = "green";
            const newDiv = document.createElement('div');
            newDiv.style.width = '100%';
            newDiv.style.display = 'flex';
            newDiv.style.marginTop = '5px';
            newDiv.style.justifyContent = 'center';
            newDiv.style.alignItems = 'center';
            newDiv.style.minHeight = '50px';
            newDiv.style.backgroundColor = 'white';
            element.parentNode.insertBefore(newDiv, element.nextSibling);
            nonToxicStatement = toxicity['non-toxic statement'];
            nonToxicStatement.forEach((statement)=>{
              const p = document.createElement('p');
              p.textContent = statement;
              p.style.fontSize = '18px';
              p.style.color = 'black';
              p.style.cursor = 'pointer';
              p.style.padding = '5px';
              p.style.margin = '5px';
              p.onclick = () => {
                tweet.textContent = statement;
                tweet.style.backgroundColor = 'green'
              }
              newDiv.appendChild(p);
            })
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
  