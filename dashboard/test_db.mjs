import fs from 'fs';
import mysql from 'mysql2/promise';

const envVars = fs.readFileSync('.env.local', 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length) acc[key.trim()] = vals.join('=').trim().replace(/["']/g, '');
    return acc;
  }, {});

async function testConnection() {
  console.log("Connecting to", envVars.MYSQL_HOST, ":", envVars.MYSQL_PORT, "as", envVars.MYSQL_USER);
  try {
    const connection = await mysql.createConnection({
      host: envVars.MYSQL_HOST,
      user: envVars.MYSQL_USER,
      password: envVars.MYSQL_PASSWORD,
      database: envVars.MYSQL_DATABASE,
      port: parseInt(envVars.MYSQL_PORT || '3306'),
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
