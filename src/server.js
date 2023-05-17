const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Config middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

app.use(require('./routes/admin.route'))
app.use(require('./routes/product.route'))
app.use(require('./routes/order.route'))

app.use(require('./middleware/errorHandler'))

app.listen(process.env.PORT || 3000, ()=>{
    console.log("App is listening ......");
})