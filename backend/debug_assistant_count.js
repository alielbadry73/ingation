const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./backend/database.sqlite');

console.log('🔍 Debugging assistant count issue...\n');

// Check assistants
db.all('SELECT id, name, subject FROM assistants', (err, assistants) => {
    if (err) {
        console.error('Error:', err);
        return;
    }
    
    console.log('📋 Assistants:');
    assistants.forEach(a => {
        console.log(`  ID: ${a.id}, Name: ${a.name}, Subject: "${a.subject}" (length: ${a.subject.length})`);
        console.log(`  Subject bytes:`, Buffer.from(a.subject).toString('hex'));
    });
    
    console.log('\n');
    
    // Check teachers
    db.all('SELECT id, first_name, last_name, email, subject FROM teachers', (err, teachers) => {
        if (err) {
            console.error('Error:', err);
            return;
        }
        
        console.log('👨‍🏫 Teachers:');
        teachers.forEach(t => {
            console.log(`  ID: ${t.id}, Name: ${t.first_name} ${t.last_name}, Subject: "${t.subject}" (length: ${t.subject.length})`);
            console.log(`  Subject bytes:`, Buffer.from(t.subject).toString('hex'));
        });
        
        console.log('\n');
        
        // Check the GROUP BY query
        db.all('SELECT subject, COUNT(*) as count FROM assistants GROUP BY subject', (err, counts) => {
            if (err) {
                console.error('Error:', err);
                return;
            }
            
            console.log('📊 Assistant counts by subject:');
            counts.forEach(c => {
                console.log(`  Subject: "${c.subject}" -> Count: ${c.count}`);
            });
            
            db.close();
        });
    });
});
