const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

console.log('🔍 Checking Ali ElBadry enrollment status...');

// Find Ali's user ID
db.get('SELECT id, first_name, last_name, email FROM users WHERE email = ?', ['alielbadry279@gmail.com'], (err, user) => {
    if (err) {
        console.error('Error finding user:', err);
        db.close();
        return;
    }
    
    if (!user) {
        console.log('❌ User not found');
        db.close();
        return;
    }
    
    console.log('✅ Found user:', user.first_name, user.last_name);
    console.log('📧 Email:', user.email);
    console.log('🆔 User ID:', user.id);
    
    // Check current enrollments
    db.all('SELECT e.*, c.title FROM enrollments e LEFT JOIN courses c ON e.course_id = c.id WHERE e.student_id = ?', [user.id], (err, enrollments) => {
        if (err) {
            console.error('Error checking enrollments:', err);
            db.close();
            return;
        }
        
        console.log('\n📚 Current enrollments:');
        if (enrollments.length === 0) {
            console.log('  No enrollments found');
        } else {
            enrollments.forEach((enrollment, index) => {
                console.log(`  ${index + 1}. Course ID: ${enrollment.course_id} - ${enrollment.title || 'Course ' + enrollment.course_id} (Active: ${enrollment.is_active ? 'Yes' : 'No'})`);
            });
        }
        
        // Check if enrolled in Physics (course ID 1)
        const physicsEnrollment = enrollments.find(e => e.course_id === 1);
        
        if (!physicsEnrollment) {
            console.log('\n❌ Not enrolled in Physics (Course ID 1)');
            console.log('🔧 Enrolling Ali in Physics course...');
            
            // Enroll in Physics
            db.run('INSERT INTO enrollments (student_id, course_id, is_active) VALUES (?, ?, ?)', [user.id, 1, 1], (err) => {
                if (err) {
                    console.error('Error enrolling in Physics:', err);
                } else {
                    console.log('✅ Successfully enrolled in Physics course!');
                    console.log('🎉 Ali ElBadry should now appear in the Physics leaderboard!');
                }
                db.close();
            });
        } else {
            console.log('\n✅ Already enrolled in Physics');
            db.close();
        }
    });
});
