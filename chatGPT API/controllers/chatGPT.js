module.exports.classifyToxicity = async (req, res) => {
    const { statement } = req.body;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ process.env.OPENAI_API_KEY }`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `Classify the following statement as either toxic or non-toxic - ${ statement }.
        If the statement is toxic, provide an array of three corresponding statements that is non-toxic in the below format in place of value for non-toxic statement.
        Also, create an array of toxic words containing in the statement and put it in place of value for the key - toxic words in the below format.
        If the statement is non-toxic, provide an array of three corresponding statements that can enhance the meaning of the original statement.
        The response generated by you must be in the json format as follows:
         {
            "class": 'toxic' // 'non-toxic' for non-toxic statement,
            "non-toxic statement": value,
            "toxic words": value
         }
        ` }],
        max_tokens: 100,
      }),
    })
  
    const data = await response.json();
    return res.send(data.choices[0].message.content);
}