document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded')
    document.getElementById('checkToxicity').addEventListener('click', function() {
        console.log('Btn clicked')
        chrome.runtime.sendMessage({ action: 'checkToxicity' }, (response) => {
            console.log(response)
        });
    });
    chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
        if(message.action === 'toxicityResponse') {
            console.log(message.data['non-toxic statement'])
            document.getElementById('nonToxic').innerText = message.data['non-toxic statement']
        }
    })
    const copyToClipboard = () => {
        let element = document.getElementById('nonToxic'); 
        let textArea = document.createElement('textarea');
        textArea.value = element.textContent;
        textArea.style.position = 'fixed';
        textArea.style.opacity = 0;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            console.log('Text copied to clipboard');
          } catch (err) {
            console.error('Unable to copy text to clipboard', err);
          }
        document.body.removeChild(textArea);
    }
    document.getElementById('copyBtn').addEventListener('click', () => copyToClipboard())
});
 