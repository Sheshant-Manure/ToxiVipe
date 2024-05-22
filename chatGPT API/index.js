const express = require('express');
const app = express();
const chatgptAPIRoutes = require('./routes/chatgptAPI')
const cors = require('cors');

app.use(cors({
    origin: 'https://x.com'
}))

require('dotenv').config();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use('/chatgpt', chatgptAPIRoutes)

app.listen( port,()=>{
    console.log(`Server is running on ${ port }`) 
});