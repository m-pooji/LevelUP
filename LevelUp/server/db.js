// db.js
import mysql from 'mysql2/promise';

// Create a connection pool. This is better than a single connection
// as it manages multiple connections at once.
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // <-- Change this to your MySQL username
  password: 'Poojitha', // <-- Change this to your MySQL password
  database: 'levelup_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log("MySQL Connection Pool created.");

// Export the pool so we can use it in our other files
export default pool;