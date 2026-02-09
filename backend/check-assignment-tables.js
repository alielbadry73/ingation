const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

console.log('🔍 Checking assignment-related tables...');

// Get all tables
db.all('SELECT name FROM sqlite_master WHERE type="table"', (err, tables) => {
    if (err) {
        console.error('Error getting tables:', err);
        db.close();
        return;
    }
    
    console.log('📋 All tables:');
    const assignmentTables = tables.filter(table => 
        table.name.toLowerCase().includes('assignment') || 
        table.name.toLowerCase().includes('assessment') ||
        table.name.toLowerCase().includes('quiz') ||
        table.name.toLowerCase().includes('exam')
    );
    
    if (assignmentTables.length === 0) {
        console.log('  No assignment-related tables found');
    } else {
        assignmentTables.forEach((table, index) => {
            console.log(`  ${index + 1}. ${table.name}`);
        });
    }
    
    // Check if there's a general assignments table
    db.all('SELECT name FROM sqlite_master WHERE type="table" AND name LIKE "%assignment%"', (err, assignmentTables) => {
        if (err) {
            console.error('Error checking assignment tables:', err);
            db.close();
            return;
        }
        
        console.log('\n📚 Assignment tables found:');
        assignmentTables.forEach((table, index) => {
            console.log(`  ${index + 1}. ${table.name}`);
            
            // Check structure of first assignment table
            if (index === 0) {
                db.all(`PRAGMA table_info(${table.name})`, (err, cols) => {
                    if (err) {
                        console.error(`Error checking ${table.name} structure:`, err);
                        return;
                    }
                    
                    console.log(`\n📋 ${table.name} structure:`);
                    cols.forEach(col => {
                        console.log(`  - ${col.name} (${col.type})`);
                    });
                    
                    // Check for Ali's data
                    db.all(`SELECT * FROM ${table.name} WHERE user_id = ? OR user_email = ? LIMIT 5`, [16, 'alielbadry279@gmail.com'], (err, rows) => {
                        if (err) {
                            console.error(`Error checking ${table.name} data:`, err);
                            return;
                        }
                        
                        console.log(`\n👤 Ali's data in ${table.name}:`);
                        if (rows.length === 0) {
                            console.log('  No data found');
                        } else {
                            rows.forEach((row, index) => {
                                console.log(`  ${index + 1}.`, Object.keys(row).map(key => `${key}: ${row[key]}`).join(', '));
                            });
                        }
                        
                        db.close();
                    });
                });
            }
        });
    });
});
