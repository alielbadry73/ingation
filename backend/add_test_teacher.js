const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

console.log('➕ Adding test teacher to database...\n');

const teacher = {
    email: 'ahmedmohamed12@gmail.com',
    // Using a pre-hashed password (bcrypt hash of "password123")
    password: '$2a$10$sEbAPkjfJJvjawkm9QaGR.HF8fciKyxTUZl4fieqtfwN.xQpVgkZC',
    first_name: 'ahmed',
    last_name: 'maarouf',
    phone: '01040450814',
    phone_country: 'EG',
    role: 'teacher',
    subject: 'Physics',
    experience: '12'
};

db.run(`INSERT INTO teachers (email, password, first_name, last_name, phone, phone_country, role, subject, experience, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [teacher.email, teacher.password, teacher.first_name, teacher.last_name, teacher.phone, teacher.phone_country, teacher.role, teacher.subject, teacher.experience],
    function(err) {
        if (err) {
            if (err.message && err.message.includes('UNIQUE constraint failed')) {
                console.log('⚠️  Teacher with this email already exists');
                
                // Update instead
                db.run(`UPDATE teachers SET subject = ?, experience = ?, first_name = ?, last_name = ? WHERE email = ?`,
                    [teacher.subject, teacher.experience, teacher.first_name, teacher.last_name, teacher.email],
                    function(updateErr) {
                        if (updateErr) {
                            console.error('Error updating teacher:', updateErr);
                        } else {
                            console.log('✅ Teacher updated successfully');
                        }
                        db.close();
                    }
                );
            } else {
                console.error('❌ Error adding teacher:', err);
                db.close();
            }
            return;
        }
        
        console.log(`✅ Teacher added successfully with ID: ${this.lastID}`);
        console.log(`   Name: ${teacher.first_name} ${teacher.last_name}`);
        console.log(`   Email: ${teacher.email}`);
        console.log(`   Subject: ${teacher.subject}`);
        console.log(`   Experience: ${teacher.experience} years`);
        console.log(`   Password: password123`);
        
        // Verify
        db.get('SELECT COUNT(*) as count FROM teachers WHERE subject = ?', [teacher.subject], (err, result) => {
            if (err) {
                console.error('Error counting:', err);
            } else {
                console.log(`\n📊 Total ${teacher.subject} teachers: ${result.count}`);
            }
            db.close();
        });
    }
);
