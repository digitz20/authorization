require('./config/database')
const express = require('express')
const express_session = require('express-session')


const PORT = process.env.port || 4805

const userRouter = require('./routes/userRouter')
const scoreRouter = require('./routes/userRouter')

require('./middleware/passport')

const app = express()
app.use(express.json())

app.use(express_session({secret: process.env.JWT_SECRET, resave: false, saveUninitialized: false}))
app.use('/api/v1/', userRouter)
app.use('/api/v1/', scoreRouter)

app.listen(PORT, () => {
    console.log(`server is listening to port ${PORT}`)
})








