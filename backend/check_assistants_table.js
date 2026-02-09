const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

console.log('🔍 Checking assistants table schema...\n');

// Check if assistants table exists
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='assistants'", (err, row) => {
    if (err) {
        console.error('Error checking table:', err);
        db.close();
        return;
    }
    
    if (!row) {
        console.log('❌ Assistants table does not exist');
        db.close();
        return;
    }
    
    console.log('✅ Assistants table exists!\n');
    
    // Get table schema
    db.all("PRAGMA table_info('assistants')", (err, cols) => {
        if (err) {
            console.error('Error getting schema:', err);
            db.close();
            return;
        }
        
        console.log('📋 Assistants table columns:');
        cols.forEach(col => {
            console.log(`  - ${col.name} (${col.type})`);
        });
        
        console.log('\n');
        
        // Count assistants
        db.get('SELECT COUNT(*) as count FROM assistants', (err, result) => {
            if (err) {
                console.error('Error counting assistants:', err);
            } else {
                console.log(`📊 Total assistants: ${result.count}`);
            }
            db.close();
        });
    });
});
