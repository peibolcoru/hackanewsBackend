const mysql = require ('mysql2/promise')
require('dotenv').config();


//const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env

let pool
const getConnection = async () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      ssl: process.env.MYSQL_SSL ?  { rejectUnauthorized: false } : false,
      timezone: "local",
      connectionLimit: 10,
    })
  }
  return await pool.getConnection()
}

const sendQuery = async (query, values) => {
  let connection
  try {
    connection = await getConnection()
    const [results] = await connection.query(query, values)
    return results
  } catch (error) {
    throw new Error(error.message)
  } finally {
    if (connection) {
      connection.release()
    }
  }
}

module.exports = sendQuery
