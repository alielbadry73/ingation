/**
 * Resets all data used by the admin panel (and the rest of the app).
 * Run from backend folder: node reset-admin-data.js
 *
 * After running:
 * - All users, orders, enrollments, teachers, assistants, etc. are cleared.
 * - Re-create admin logins with: node create-admin-credentials.js
 */
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Tables to clear in dependency order (children before parents)
const TABLES = [
  'submissions',
  'assignments',
  'exams',
  'quizzes',
  'lectures',
  'password_resets',
  'enrollments',
  'orders',
  'assistants',
  'teachers',
  'users',
];

function clearTable(name, cb) {
  db.run(`DELETE FROM ${name}`, function (err) {
    if (err) {
      if (err.message && err.message.includes('no such table')) {
        return cb(null);
      }
      return cb(err);
    }
    console.log(`Cleared: ${name} (${this.changes} row(s))`);
    cb(null);
  });
}

function run() {
  let i = 0;
  function next() {
    if (i >= TABLES.length) {
      console.log('\n✅ All admin panel data has been reset.');
      db.close();
      return;
    }
    clearTable(TABLES[i], (err) => {
      if (err) {
        console.error('Error clearing', TABLES[i], err.message);
      }
      i++;
      next();
    });
  }
  next();
}

run();
