const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./backend/database.sqlite');

console.log('➕ Adding assistant with correct schema...\n');

const assistant = {
    name: 'alex',
    email: 'alexjohnson@gmail.com',
    phone: '01040450814',
    subject: 'Physics',
    availability: 'full-time',
    status: 'pending',
    qualifications: 'MSc in Physics',
    specializations: 'Quantum Mechanics, Thermodynamics',
    roleDescription: 'Physics Teaching Assistant',
    createdBy: 'admin'
};

db.run(`
    INSERT INTO assistants (
        name, email, phone, subject, availability, status,
        qualifications, specializations, roleDescription, createdBy
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`, [
    assistant.name,
    assistant.email,
    assistant.phone,
    assistant.subject,
    assistant.availability,
    assistant.status,
    assistant.qualifications,
    assistant.specializations,
    assistant.roleDescription,
    assistant.createdBy
], function(err) {
    if (err) {
        console.error('❌ Error:', err);
        db.close();
        return;
    }
    
    console.log(`✅ Assistant added! ID: ${this.lastID}\n`);
    
    // Verify
    db.all('SELECT id, name, email, subject, status FROM assistants', (err, rows) => {
        if (err) {
            console.error('Error:', err);
        } else {
            console.log(`📋 Total assistants: ${rows.length}`);
            rows.forEach(r => {
                console.log(`  - ${r.name} (${r.email}) - ${r.subject} - Status: ${r.status}`);
            });
        }
        db.close();
    });
});
