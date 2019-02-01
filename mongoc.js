const MongoClient = require('mongodb').MongoClient
// Connection URL
const url = 'mongodb://127.0.0.1:27017'
// Create a new MongoClient
async function getClient() {
  const client = await MongoClient.connect('mongodb://127.0.0.1:27017')
  return client
}

module.exports = {
  getClient: getClient
}
