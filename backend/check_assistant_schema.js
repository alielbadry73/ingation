const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('=== CHECKING ASSISTANTS TABLE SCHEMA ===\n');

db.all("PRAGMA table_info(assistants)", [], (err, columns) => {
    if (err) {
        console.error('Error:', err);
        db.close();
        return;
    }
    
    console.log('Columns in assistants table:');
    columns.forEach(col => {
        console.log(`- ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : ''} ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''}`);
    });
    
    // Now get the actual data with all columns
    db.all('SELECT * FROM assistants', [], (err, rows) => {
        if (err) {
            console.error('Error:', err);
            db.close();
            return;
        }
        
        console.log('\n=== ACTUAL DATA ===');
        console.log(JSON.stringify(rows, null, 2));
        
        db.close();
    });
});
