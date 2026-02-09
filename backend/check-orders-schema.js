const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.all('PRAGMA table_info(orders)', (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Orders table schema:');
    rows.forEach(row => {
      console.log(`- ${row.name} (${row.type}) ${row.notnull ? 'NOT NULL' : 'NULL'} ${row.pk ? 'PRIMARY KEY' : ''}`);
    });
  }
  db.close();
});
