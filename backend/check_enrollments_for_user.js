const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

const userEmail = 'alielbadry279@gmail.com';

// First, check what tables exist
db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
  if (err) {
    console.error('Error getting tables:', err);
    db.close();
    return;
  }
  
  console.log('Available tables:', tables.map(t => t.name));
  
  // Check if enrollments table exists
  const hasEnrollments = tables.some(t => t.name === 'enrollments');
  
  if (hasEnrollments) {
    // Get enrollments schema
    db.all("PRAGMA table_info('enrollments')", (err, schema) => {
      if (err) {
        console.error('Error getting schema:', err);
        db.close();
        return;
      }
      
      console.log('\nEnrollments table schema:');
      console.table(schema);
      
      // Get all enrollments
      db.all("SELECT * FROM enrollments", (err, rows) => {
        if (err) {
          console.error('Error getting enrollments:', err);
        } else {
          console.log('\nAll enrollments:');
          console.log(JSON.stringify(rows, null, 2));
        }
        db.close();
      });
    });
  } else {
    console.log('\n⚠️ No enrollments table found!');
    console.log('Checking localStorage for enrolled courses...');
    db.close();
  }
});
