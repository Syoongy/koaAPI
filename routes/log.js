const assert = require('assert')
const dbConnection = require('../mongoc')

// Database Name
const dbName = 'mydatabase'

module.exports = ({
  router
}) => {
  // getting the home route
  router.get('/log/getAll', async (ctx, next) => {
    const client = await dbConnection.getClient()
    const db = client.db(dbName)
    const col = db.collection('log')
    const retList = await col.find().toArray()
    client.close()
    ctx.body = retList
  })

}
