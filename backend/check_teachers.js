const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

db.all('SELECT * FROM teachers', (err, rows) => {
    if (err) {
        console.error('Error:', err);
        db.close();
        process.exit(1);
    }
    
    console.log('Teachers in database:', rows.length);
    console.log(JSON.stringify(rows, null, 2));
    
    db.close();
    process.exit(0);
});
