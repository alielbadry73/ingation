const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

console.log('🔍 Checking teacher subjects...\n');

db.all('SELECT id, email, first_name, last_name, subject FROM teachers', (err, rows) => {
    if (err) {
        console.error('Error querying teachers:', err);
        db.close();
        return;
    }
    
    console.log(`📋 Teachers in database: ${rows.length}\n`);
    
    rows.forEach(teacher => {
        console.log(`Teacher ID: ${teacher.id}`);
        console.log(`  Name: ${teacher.first_name} ${teacher.last_name}`);
        console.log(`  Email: ${teacher.email}`);
        console.log(`  Subject: "${teacher.subject}" (length: ${teacher.subject ? teacher.subject.length : 0})`);
        console.log('');
    });
    
    // Check assistants
    db.all('SELECT id, name, subject FROM assistants', (err, assistants) => {
        if (err) {
            console.error('Error querying assistants:', err);
        } else {
            console.log(`\n📋 Assistants in database: ${assistants.length}\n`);
            assistants.forEach(assistant => {
                console.log(`Assistant ID: ${assistant.id}`);
                console.log(`  Name: ${assistant.name}`);
                console.log(`  Subject: "${assistant.subject}" (length: ${assistant.subject ? assistant.subject.length : 0})`);
                console.log('');
            });
            
            // Check if subjects match
            console.log('\n🔍 Checking subject matches:');
            rows.forEach(teacher => {
                const matchingAssistants = assistants.filter(a => a.subject === teacher.subject);
                console.log(`  ${teacher.first_name} (${teacher.subject}): ${matchingAssistants.length} matching assistant(s)`);
            });
        }
        db.close();
    });
});
