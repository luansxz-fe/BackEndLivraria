import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'dblivraria'
});

console.log('✅ Conectado ao MySQL');

export default db;