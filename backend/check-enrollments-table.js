const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

console.log('🔍 Checking enrollments table structure...');

// Check if enrollments table exists
db.all('SELECT name FROM sqlite_master WHERE type="table" AND name="enrollments"', (err, rows) => {
    if (err) {
        console.error('Error checking table existence:', err);
        db.close();
        return;
    }
    
    if (rows.length === 0) {
        console.log('❌ Enrollments table does not exist');
        db.close();
        return;
    }
    
    console.log('✅ Enrollments table exists');
    
    // Check table structure
    db.all('PRAGMA table_info(enrollments)', (err, cols) => {
        if (err) {
            console.error('Error checking enrollments schema:', err);
            db.close();
            return;
        }
        
        console.log('📋 Enrollments table columns:');
        cols.forEach(col => {
            console.log(`  - ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : 'NULL'} ${col.pk ? 'PRIMARY KEY' : ''}`);
        });
        
        // Check if there are any enrollments
        db.all('SELECT COUNT(*) as count FROM enrollments', (err, result) => {
            if (err) {
                console.error('Error counting enrollments:', err);
            } else {
                console.log(`📊 Total enrollments: ${result[0].count}`);
            }
            
            // Check users table structure for points column
            db.all('PRAGMA table_info(users)', (err, userCols) => {
                if (err) {
                    console.error('Error checking users schema:', err);
                    db.close();
                    return;
                }
                
                console.log('👥 Users table columns:');
                userCols.forEach(col => {
                    console.log(`  - ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : 'NULL'} ${col.pk ? 'PRIMARY KEY' : ''}`);
                });
                
                // Check if there are any users
                db.all('SELECT COUNT(*) as count FROM users', (err, userResult) => {
                    if (err) {
                        console.error('Error counting users:', err);
                    } else {
                        console.log(`👥 Total users: ${userResult[0].count}`);
                    }
                    
                    db.close();
                });
            });
        });
    });
});
