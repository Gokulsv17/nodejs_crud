const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let database;

async function getDatabase() {
  const client = await MongoClient.connect("mongodb://localhost:27017");
  database = client.db("library");

  if (!database) {
    console.log("database is not connected");
  }
  return database;
}

module.exports = { getDatabase};
