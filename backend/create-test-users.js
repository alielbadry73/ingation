const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./database.sqlite');

const testUsers = [
  { email: 'john@example.com', password: 'password123', firstName: 'John', lastName: 'Doe', role: 'student' },
  { email: 'sarah@example.com', password: 'password123', firstName: 'Sarah', lastName: 'Smith', role: 'student' }
];

testUsers.forEach((user, index) => {
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      return;
    }
    
    const sql = `INSERT OR IGNORE INTO users (email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)`;
    const params = [user.email, hash, user.firstName, user.lastName, user.role];
    
    db.run(sql, params, function(err) {
      if (err) {
        console.error('Error inserting user:', err);
      } else {
        console.log('✅ User created/exists:', user.email);
      }
      
      if (index === testUsers.length - 1) {
        db.close(() => {
          console.log('🎉 Test users ready!');
        });
      }
    });
  });
});
