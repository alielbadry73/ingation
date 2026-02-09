const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

console.log('🔧 Creating assistants table...\n');

const createTableSQL = `
    CREATE TABLE IF NOT EXISTS assistants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        subject TEXT NOT NULL,
        teacher_id INTEGER,
        is_active INTEGER DEFAULT 1,
        availability TEXT,
        qualifications TEXT,
        specializations TEXT,
        role_description TEXT,
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_id) REFERENCES teachers(id),
        FOREIGN KEY (created_by) REFERENCES teachers(id)
    )
`;

db.run(createTableSQL, (err) => {
    if (err) {
        console.error('❌ Error creating assistants table:', err);
        db.close();
        return;
    }
    
    console.log('✅ Assistants table created successfully!\n');
    
    // Verify table structure
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
        
        console.log('\n✅ Table is ready for use!');
        db.close();
    });
});
