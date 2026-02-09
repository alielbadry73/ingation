const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./backend/database.sqlite');

console.log('🔍 Checking assistant data...\n');

db.all('SELECT * FROM assistants', (err, rows) => {
    if (err) {
        console.error('❌ Error:', err);
        db.close();
        return;
    }
    
    console.log(`📊 Total assistants found: ${rows.length}\n`);
    
    if (rows.length === 0) {
        console.log('⚠️ No assistants in database!');
    } else {
        rows.forEach((row, index) => {
            console.log(`Assistant ${index + 1}:`);
            console.log(JSON.stringify(row, null, 2));
            console.log('');
        });
    }
    
    db.close();
});
