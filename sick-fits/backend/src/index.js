const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

require('dotenv').config({ path: 'variables.env' })
const createServer = require('./createServer')
const db = require('./db')

const server = createServer()

// TODO Use exporess middleware to handle cookies (JWT)
server.express.use(cookieParser())
// TODO Use express middleware to populate current user
// Decode JWT to get user ID for each request
server.express.use((req, res, next) => {
  const { token } = req.cookies
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET)
    // Put user ID onto request for future requests to access
    req.userId = userId
  }
  next()
})

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  options => {
    console.log(`Server is running on port http://localhost:${options.port}`)
  },
)
