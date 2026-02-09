const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

// Check if teachers table exists
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='teachers'", (err, row) => {
    if (err) {
        console.error('Error checking table:', err);
        db.close();
        return;
    }
    
    if (!row) {
        console.log('❌ Teachers table does not exist. Creating it now...');
        
        // Create teachers table
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS teachers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                first_name TEXT,
                last_name TEXT,
                phone TEXT,
                phone_country TEXT DEFAULT 'EG',
                role TEXT DEFAULT 'teacher',
                subject TEXT,
                experience TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        db.run(createTableSQL, (err) => {
            if (err) {
                console.error('❌ Error creating teachers table:', err);
            } else {
                console.log('✅ Teachers table created successfully!');
                
                // Now check for teachers
                db.all('SELECT id, email, first_name, last_name, subject, experience FROM teachers', (err, rows) => {
                    if (err) {
                        console.error('Error querying teachers:', err);
                    } else {
                        console.log('\n📋 Teachers in database:', rows.length);
                        console.log(JSON.stringify(rows, null, 2));
                    }
                    db.close();
                });
            }
        });
    } else {
        console.log('✅ Teachers table exists!');
        
        // Query teachers
        db.all('SELECT id, email, first_name, last_name, subject, experience FROM teachers', (err, rows) => {
            if (err) {
                console.error('Error querying teachers:', err);
            } else {
                console.log('\n📋 Teachers in database:', rows.length);
                console.log(JSON.stringify(rows, null, 2));
            }
            db.close();
        });
    }
});
