'use strict'

const fs = require('fs')
const mongo = require('mongodb')

const koa = require('koa')
const koaRouter = require('koa-router')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('@koa/cors')

const dbConnection = require('./mongoc')

const chosenPort = 1234

const app = new koa()

app.use(bodyParser())
// Log events to terminal
app.use(logger())
// Enable CORS
app.use(cors())

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = err.message
    ctx.app.emit('error', err, ctx)
  }
})

// Initialise router and routes
const router = new koaRouter()

// This can be written as so:
// const logRoutes = require('./routes/log')
// basicRoutes({router])
// However, you will need to instantiate a variable
require('./routes/log')({
  router
})

router.get('/video/:id', async (ctx, next) => {
  const logID = new mongo.ObjectID(ctx.params.id)
  const client = await dbConnection.getClient()
  const db = client.db('mydatabase')
  const col = db.collection('log')
  const log = await col.findOne({'_id': logID})
  client.close()
  ctx.type = 'video/mp4'
  ctx.response.body = fs.createReadStream(log.file)
  ctx.response.status = 200
})

app.use(router.routes()).use(router.allowedMethods())
app.listen(chosenPort, () => {
  console.log(`Server started on port: ${chosenPort}`)
})
