/**
 * Creates 5 admin user accounts in the database.
 * Run from backend folder: node create-admin-credentials.js
 * Login at: http://localhost:3000/admin-login.html
 */
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const USERS = [
  { email: 'admin1@ignation.com', password: 'Admin1#Secure', first_name: 'Admin', last_name: 'One' },
  { email: 'admin2@ignation.com', password: 'Admin2#Secure', first_name: 'Admin', last_name: 'Two' },
  { email: 'admin3@ignation.com', password: 'Admin3#Secure', first_name: 'Admin', last_name: 'Three' },
  { email: 'admin4@ignation.com', password: 'Admin4#Secure', first_name: 'Admin', last_name: 'Four' },
  { email: 'admin5@ignation.com', password: 'Admin5#Secure', first_name: 'Admin', last_name: 'Five' },
];

const ROLE = 'admin';

function upsertUser(user, hash, callback) {
  db.run(
    'INSERT INTO users (email, password, first_name, last_name, role, username) VALUES (?, ?, ?, ?, ?, ?)',
    [user.email, hash, user.first_name, user.last_name, ROLE, user.email],
    function (err) {
      if (err && err.message && err.message.includes('UNIQUE')) {
        db.run(
          'UPDATE users SET password = ?, first_name = ?, last_name = ?, role = ? WHERE email = ?',
          [hash, user.first_name, user.last_name, ROLE, user.email],
          (uErr) => {
            callback(uErr);
          }
        );
      } else {
        callback(err);
      }
    }
  );
}

function run() {
  let done = 0;
  const total = USERS.length;

  USERS.forEach((u) => {
    bcrypt.hash(u.password, 10, (err, hash) => {
      if (err) {
        console.error('Hash error for', u.email, err);
        if (++done === total) {
          console.log('\nDone. Credentials are in ADMIN_CREDENTIALS.md');
          db.close();
        }
        return;
      }
      upsertUser(u, hash, (dbErr) => {
        if (dbErr) console.error('DB error for', u.email, dbErr.message);
        else console.log('OK:', u.email);
        if (++done === total) {
          console.log('\nDone. Credentials are in ADMIN_CREDENTIALS.md');
          db.close();
        }
      });
    });
  });
}

run();
