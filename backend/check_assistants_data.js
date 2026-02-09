const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

console.log('🔍 Checking assistants data...\n');

// Get all assistants
db.all('SELECT * FROM assistants', (err, rows) => {
    if (err) {
        console.error('Error querying assistants:', err);
        db.close();
        return;
    }
    
    console.log(`📋 Total assistants in database: ${rows.length}\n`);
    
    if (rows.length > 0) {
        console.log('Assistants:');
        rows.forEach(assistant => {
            console.log(`  - ID: ${assistant.id}`);
            console.log(`    Name: ${assistant.name}`);
            console.log(`    Email: ${assistant.email}`);
            console.log(`    Subject: ${assistant.subject}`);
            console.log(`    Phone: ${assistant.phone || 'N/A'}`);
            console.log(`    Status: ${assistant.is_active ? 'Active' : 'Inactive'}`);
            console.log('');
        });
    } else {
        console.log('❌ No assistants found in database');
        console.log('\n💡 The assistant "alex" you see in the dashboard is likely stored in localStorage, not the database.');
        console.log('   This means it will only appear in that browser and won\'t sync to the admin panel.');
    }
    
    // Also check by subject
    db.all('SELECT subject, COUNT(*) as count FROM assistants GROUP BY subject', (err, counts) => {
        if (err) {
            console.error('Error counting by subject:', err);
        } else if (counts.length > 0) {
            console.log('\n📊 Assistants by subject:');
            counts.forEach(row => {
                console.log(`  - ${row.subject}: ${row.count} assistant(s)`);
            });
        }
        db.close();
    });
});
