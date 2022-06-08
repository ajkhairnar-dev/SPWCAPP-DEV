const DB = require("./db.json")
const { Client } = require("pg")

const conn = new Client({
  host: DB.host,
  user: DB.user,
  port: DB.port,
  password: DB.password,
  database: DB.database,
  ssl: {
    rejectUnauthorized: false
  }
})

conn.connect((err) => {
  if (err) {
    console.error("connection error", err.stack)
  } else {
    console.log("connected !")
  }
})

module.exports = conn
