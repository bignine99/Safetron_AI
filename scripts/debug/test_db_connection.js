const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env.local' });

async function test() {
  console.log("Testing connection to:", process.env.MYSQL_HOST);
  try {
    const pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: parseInt(process.env.MYSQL_PORT || '3306'),
    });
    const [rows] = await pool.query('SELECT 1 as result');
    console.log("Connection successful!", rows);
    process.exit(0);
  } catch (err) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  }
}

test();
