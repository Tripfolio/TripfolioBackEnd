const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors({
	origin: 'http://localhost:5173'
}))
app.use(express.json())

const authRouter = require('./src/routes/authRoutes')
app.use('/api', authRouter)

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})
