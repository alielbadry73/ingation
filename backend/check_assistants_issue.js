const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('=== CHECKING ASSISTANTS DATA ===\n');

// Check assistants table
db.all('SELECT * FROM assistants', [], (err, assistants) => {
    if (err) {
        console.error('Error reading assistants:', err);
        return;
    }
    
    console.log('Total assistants in database:', assistants.length);
    console.log('\nAssistants data:');
    assistants.forEach(assistant => {
        console.log('\n---');
        console.log('ID:', assistant.id);
        console.log('Name:', assistant.name);
        console.log('Email:', assistant.email);
        console.log('Subject:', assistant.subject);
        console.log('Teacher ID:', assistant.teacher_id);
        console.log('Created:', assistant.created_at);
    });
    
    // Check teachers table to see which teacher has ID matching the assistant
    db.all('SELECT * FROM teachers', [], (err, teachers) => {
        if (err) {
            console.error('Error reading teachers:', err);
            db.close();
            return;
        }
        
        console.log('\n\n=== TEACHERS DATA ===');
        console.log('Total teachers:', teachers.length);
        teachers.forEach(teacher => {
            console.log('\n---');
            console.log('ID:', teacher.id);
            console.log('Name:', teacher.name);
            console.log('Email:', teacher.email);
            console.log('Subject:', teacher.subject);
        });
        
        db.close();
    });
});
