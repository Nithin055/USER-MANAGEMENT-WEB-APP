const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// Connect to SQLite database
const db = new sqlite3.Database('./db/database.sqlite', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the database.');
});

// Set up the database
db.serialize(() => {
  // Create users table if it doesn't exist
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
  )`);

  // Check if we need to set up initial data
  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    if (err) {
      return console.error('Error checking users table:', err.message);
    }
    
    if (row.count === 0) {
      // Only run initial setup if the users table is empty
      db.run('INSERT OR IGNORE INTO sqlite_sequence (name, seq) VALUES ("users", 100)', (err) => {
        if (err) {
          console.error('Error setting up autoincrement:', err);
          return;
        }
        
        // Create default admin user
        const saltRounds = 10;
        bcrypt.hash('adminpassword', saltRounds, (err, hash) => {
          if (err) {
            return console.error('Error hashing password:', err.message);
          }
          
          const sql = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
          db.run(sql, ['admin', hash, 'admin'], function(err) {
            if (err) {
              console.error('Error creating admin user:', err);
            } else {
              console.log('Initial admin user created');
            }
          });
        });
      });
    }
  });
});

module.exports = db;
