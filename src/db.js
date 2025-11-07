import mysql from 'mysql2/promise';

const db = await mysql.createPool({
  host: 'localhost',
  user: 'root',       
  password: '1234',   
  database: 'dblivraria',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default db;