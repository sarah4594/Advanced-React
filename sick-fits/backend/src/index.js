const cookieParser = require('cookie-parser')

require('dotenv').config({ path: 'variables.env' })
const createServer = require('./createServer')
const db = require('./db')

const server = createServer()

// TODO Use exporess middleware to habdle cookies (JWT)
server.express.use(cookieParser())
// TODO Use express middleware to populate current user

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
