const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

// Add order_id column if it doesn't exist
db.run('ALTER TABLE orders ADD COLUMN order_id TEXT', (err) => {
  if (err) {
    // Column might already exist, check the error
    if (err.message.includes('duplicate column name')) {
      console.log('✅ order_id column already exists');
    } else {
      console.error('Error adding order_id column:', err);
    }
  } else {
    console.log('✅ order_id column added successfully');
  }
  
  // Check the updated schema
  db.all('PRAGMA table_info(orders)', (err, rows) => {
    if (err) {
      console.error('Error checking schema:', err);
    } else {
      console.log('\nUpdated orders table schema:');
      rows.forEach(row => {
        console.log(`- ${row.name} (${row.type}) ${row.notnull ? 'NOT NULL' : 'NULL'} ${row.pk ? 'PRIMARY KEY' : ''}`);
      });
    }
    db.close();
  });
});
