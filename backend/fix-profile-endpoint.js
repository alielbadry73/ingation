const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Checking database schema for profile endpoint...');

// Check if users table has all required columns
db.get("PRAGMA table_info(users)", (err, row) => {
    if (err) {
        console.error('Error checking users table:', err);
        process.exit(1);
    }
});

// Get all columns from users table
db.all("PRAGMA table_info(users)", (err, columns) => {
    if (err) {
        console.error('Error getting table info:', err);
        process.exit(1);
    }
    
    console.log('\nCurrent users table columns:');
    columns.forEach(col => {
        console.log(`  - ${col.name} (${col.type})`);
    });
    
    const columnNames = columns.map(c => c.name);
    const requiredColumns = ['id', 'first_name', 'last_name', 'email', 'phone', 'country', 'date_of_birth', 'avatar', 'points', 'role'];
    
    const missingColumns = requiredColumns.filter(col => !columnNames.includes(col));
    
    if (missingColumns.length > 0) {
        console.log('\nMissing columns:', missingColumns);
        console.log('Adding missing columns...');
        
        const alterStatements = [];
        if (!columnNames.includes('country')) {
            alterStatements.push("ALTER TABLE users ADD COLUMN country TEXT");
        }
        if (!columnNames.includes('date_of_birth')) {
            alterStatements.push("ALTER TABLE users ADD COLUMN date_of_birth TEXT");
        }
        if (!columnNames.includes('avatar')) {
            alterStatements.push("ALTER TABLE users ADD COLUMN avatar TEXT");
        }
        if (!columnNames.includes('points')) {
            alterStatements.push("ALTER TABLE users ADD COLUMN points INTEGER DEFAULT 0");
        }
        
        let completed = 0;
        alterStatements.forEach(stmt => {
            db.run(stmt, (err) => {
                if (err) {
                    console.error('Error adding column:', err);
                } else {
                    console.log('✓ Added column');
                }
                completed++;
                if (completed === alterStatements.length) {
                    console.log('\n✅ Database schema updated successfully!');
                    testProfileEndpoint();
                }
            });
        });
        
        if (alterStatements.length === 0) {
            testProfileEndpoint();
        }
    } else {
        console.log('\n✅ All required columns exist!');
        testProfileEndpoint();
    }
});

function testProfileEndpoint() {
    console.log('\nTesting profile data for user ID 11...');
    
    db.get('SELECT id, first_name, last_name, email, phone, country, date_of_birth, avatar, points, role FROM users WHERE id = ?', 
        [11], 
        (err, user) => {
            if (err) {
                console.error('❌ Error querying user:', err);
                db.close();
                process.exit(1);
            }
            
            if (!user) {
                console.error('❌ User with ID 11 not found!');
                db.close();
                process.exit(1);
            }
            
            console.log('\n✅ User data found:');
            console.log(JSON.stringify(user, null, 2));
            
            // Test enrollments count
            db.get('SELECT COUNT(*) as count FROM enrollments WHERE student_id = ? OR user_id = ?', 
                [11, 11], 
                (err, enrollmentData) => {
                    if (err) {
                        console.error('⚠️  Error getting enrollments:', err);
                    } else {
                        console.log(`\n✅ Enrollments count: ${enrollmentData.count}`);
                    }
                    
                    console.log('\n✅ Database check complete! The profile endpoint should work now.');
                    console.log('\nPlease restart your backend server:');
                    console.log('  1. Stop the current server (Ctrl+C)');
                    console.log('  2. Run: node backend/server.js');
                    
                    db.close();
                }
            );
        }
    );
}
