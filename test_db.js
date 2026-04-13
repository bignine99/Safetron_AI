require('dotenv').config({ path: './dashboard/.env.local' });
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log("Connecting to", process.env.MYSQL_HOST, ":", process.env.MYSQL_PORT, "as", process.env.MYSQL_USER);
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      connectTimeout: 5000
    });
    console.log("Successfully connected to MySQL Database!");
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM nodes');
    console.log("Total graph nodes in DB:", rows[0].count);
    await connection.end();
  } catch (err) {
    console.error("Database connection failed:");
    console.error(err.message);
  }
}

testConnection();
