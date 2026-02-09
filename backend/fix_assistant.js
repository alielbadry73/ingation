const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./backend/database.sqlite');

console.log('🔧 Fixing assistant data...\n');

// First, delete any existing assistant with this email
db.run('DELETE FROM assistants WHERE email = ?', ['alexjohnson@gmail.com'], function(err) {
    if (err) {
        console.error('❌ Error deleting:', err);
        db.close();
        return;
    }
    
    console.log(`🗑️  Deleted ${this.changes} existing assistant(s)\n`);
    
    // Now insert fresh assistant
    const assistant = {
        name: 'alex',
        email: 'alexjohnson@gmail.com',
        phone: '01040450814',
        subject: 'Physics',
        teacher_id: null,
        is_active: 0,
        availability: 'full-time',
        qualifications: 'MSc in Physics',
        specializations: 'Quantum Mechanics, Thermodynamics',
        role_description: 'Physics Teaching Assistant',
        created_by: null
    };
    
    db.run(`
        INSERT INTO assistants (
            name, email, phone, subject, teacher_id, is_active, 
            availability, qualifications, specializations, role_description, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        assistant.name,
        assistant.email,
        assistant.phone,
        assistant.subject,
        assistant.teacher_id,
        assistant.is_active,
        assistant.availability,
        assistant.qualifications,
        assistant.specializations,
        assistant.role_description,
        assistant.created_by
    ], function(err) {
        if (err) {
            console.error('❌ Error inserting:', err);
            db.close();
            return;
        }
        
        console.log(`✅ Assistant added successfully! ID: ${this.lastID}\n`);
        
        // Verify
        db.all('SELECT id, name, email, subject FROM assistants', (err, rows) => {
            if (err) {
                console.error('Error:', err);
            } else {
                console.log('📋 Current assistants:');
                rows.forEach(r => {
                    console.log(`  - ${r.name} (${r.email}) - Subject: ${r.subject}`);
                });
            }
            db.close();
        });
    });
});
