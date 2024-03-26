(()=>{
    let tweet;
    setTimeout(()=>{
        console.log('Webpage Loaded...')
        tweet = document.querySelector('.public-DraftStyleDefault-block');
        tweet.addEventListener("DOMSubtreeModified", () => {
            var text = tweet.textContent || tweet.innerText;
            tweet.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
            if(text === 'Sheshant') {
                tweet.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
            }
        });
    }, 7000)
})();