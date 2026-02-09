const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const email = 'mohaed.ahmed@gmail.com';

console.log('Checking user:', email);
console.log('='.repeat(50));

// Check in users table
db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
        console.error('Error querying users table:', err);
    } else if (row) {
        console.log('\n✅ Found in USERS table:');
        console.log(JSON.stringify(row, null, 2));
    } else {
        console.log('\n❌ NOT found in users table');
    }
    
    // Check in parents table
    db.get('SELECT * FROM parents WHERE email = ?', [email], (err2, row2) => {
        if (err2) {
            console.error('Error querying parents table:', err2);
        } else if (row2) {
            console.log('\n✅ Found in PARENTS table:');
            console.log(JSON.stringify(row2, null, 2));
        } else {
            console.log('\n❌ NOT found in parents table');
        }
        
        // Check in students table
        db.get('SELECT * FROM students WHERE email = ?', [email], (err3, row3) => {
            if (err3) {
                console.error('Error querying students table:', err3);
            } else if (row3) {
                console.log('\n✅ Found in STUDENTS table:');
                console.log(JSON.stringify(row3, null, 2));
            } else {
                console.log('\n❌ NOT found in students table');
            }
            
            db.close();
        });
    });
});
