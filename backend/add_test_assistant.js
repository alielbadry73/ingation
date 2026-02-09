const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

console.log('➕ Adding test assistant to database...\n');

const assistant = {
    name: 'alex',
    email: 'alexjohnson@gmail.com',
    phone: '01040450814',
    subject: 'Physics',
    teacher_id: 1,
    is_active: 0, // pending status
    availability: 'full-time',
    qualifications: null,
    specializations: null,
    role_description: null,
    created_by: 1
};

db.run(`INSERT INTO assistants (name, email, phone, subject, teacher_id, is_active, availability, qualifications, specializations, role_description, created_by, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [assistant.name, assistant.email, assistant.phone, assistant.subject, assistant.teacher_id, assistant.is_active, assistant.availability, assistant.qualifications, assistant.specializations, assistant.role_description, assistant.created_by],
    function(err) {
        if (err) {
            if (err.message && err.message.includes('UNIQUE constraint failed')) {
                console.log('⚠️  Assistant with this email already exists in database');
            } else {
                console.error('❌ Error adding assistant:', err);
            }
            db.close();
            return;
        }
        
        console.log(`✅ Assistant added successfully with ID: ${this.lastID}`);
        console.log(`   Name: ${assistant.name}`);
        console.log(`   Email: ${assistant.email}`);
        console.log(`   Subject: ${assistant.subject}`);
        console.log(`   Status: pending`);
        
        // Verify by counting
        db.get('SELECT COUNT(*) as count FROM assistants WHERE subject = ?', [assistant.subject], (err, result) => {
            if (err) {
                console.error('Error counting:', err);
            } else {
                console.log(`\n📊 Total ${assistant.subject} assistants: ${result.count}`);
            }
            db.close();
        });
    }
);
