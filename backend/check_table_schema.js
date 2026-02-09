const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./backend/database.sqlite');

console.log('🔍 Checking assistants table schema...\n');

db.all("PRAGMA table_info('assistants')", (err, cols) => {
    if (err) {
        console.error('❌ Error:', err);
        db.close();
        return;
    }
    
    if (!cols || cols.length === 0) {
        console.log('⚠️ Assistants table does not exist!');
        db.close();
        return;
    }
    
    console.log('📋 Assistants table columns:');
    cols.forEach(col => {
        console.log(`  ${col.cid}. ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : ''} ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''}`);
    });
    
    db.close();
});
