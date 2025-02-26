require('./config/database')
const express = require('express')


const PORT = process.env.port || 4805

const userRouter = require('./routes/userRouter')
const scoreRouter = require('./routes/userRouter')


const app = express()
app.use(express.json())

app.use('/api/v1/', userRouter)
app.use('/api/v1/', scoreRouter)

app.listen(PORT, () => {
    console.log(`server is listening to port ${PORT}`)
})