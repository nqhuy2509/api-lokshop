const express = require('express')
require('dotenv').config()

const app = express()

// Config middleware
app.use(express.json())

app.use(require('./routes/admin.route'))

app.use(require('./middleware/errorHandler'))

app.listen(process.env.PORT || 3000, ()=>{
    console.log("App is listening ......");
})