const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./database.sqlite');

const email = 'alielbadry279@gmail.com';
const password = 'password123';
const firstName = 'Ali';
const lastName = 'ElBadry';
const phone = '01234567890';

// Hash the password
bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error('Error hashing password:', err);
        return;
    }
    
    console.log('Password hashed successfully');
    
    // Insert user into users table
    const sql = `INSERT OR REPLACE INTO users (email, password, first_name, last_name, phone, role) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [email, hash, firstName, lastName, phone, 'student'];
    
    db.run(sql, params, function(err) {
        if (err) {
            console.error('Error inserting user:', err);
        } else {
            console.log('✅ User created successfully!');
            console.log('Email:', email);
            console.log('Password:', password);
            console.log('Name:', firstName, lastName);
        }
        
        db.close();
    });
});
