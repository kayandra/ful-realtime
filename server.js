const express = require('express')
const nunjucks = require('nunjucks')
const random = require('random-int')

/**
 * constants
 */
const app = express()
const port = process.env.PORT || 3000
const db = new Map()

/**
 * Enable websockets support
 */
const wss = require('express-ws')(app)

/**
 * Template rendering
 */
const engine = nunjucks.configure('views', {
  autoescape: true,
  express: app,
})

// Sets Nunjucks as the Express template engine
app.set('engine', engine)

/**
 * Middlewares
 */
app.use(express.static('public'))
app.use((req, res, next) => {
  engine.addGlobal('request', req)
  engine.addGlobal('socket_address', `/:${port}`)

  // process to the next middleware
  next()
})

/**
 * Routes
 */
app.get('/', (req, res) => res.render('index.njk', { totalUsers: db.size }))

app.get('/play/:code', (req, res) => {
  return db.has(req.params.code)
    ? res.render('play.njk')
    : res.status(404).render('404.njk', { db })
})

app.get('/control', (req, res) => res.render('control.njk'))

// post routes
app.get('/code/:code', (req, res) => {
  return res.json({ found: db.has(req.params.code) })
})

app.post('/code', (req, res) => {
  const code = random(10000, 99999)

  db.set(String(code), null)

  return res.json({ code })
})

/**
 * Server sent events
 */
app.get('/live', (req, res) => {
  // SSE Setup
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  })
  res.write('\n')

  // Every second, send number of connected users
  const timer = setInterval(() => res.write(`data: ${db.size}\n\n`), 1000)

  req.on('close', () => clearInterval(timer))
})

/**
 * Websockets
 */
app.ws('/echo', (ws, req) => {
  ws.on('message', (message) => {
    wss.getWss().clients.forEach(item => item.send(message))
  })
})

/**
 * Start server
 */
app.listen(port, () => console.log(`App started and listening on port ${port}`))
