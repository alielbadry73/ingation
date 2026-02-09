const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

console.log('🔍 Checking enrollment data...');

// Check all enrollments
db.all('SELECT * FROM enrollments', (err, enrollments) => {
    if (err) {
        console.error('Error fetching enrollments:', err);
        db.close();
        return;
    }
    
    console.log('📊 All enrollments:');
    enrollments.forEach((enrollment, index) => {
        console.log(`  ${index + 1}. ID: ${enrollment.id}, Student ID: ${enrollment.student_id}, Course ID: ${enrollment.course_id}, Status: ${enrollment.is_active ? 'active' : 'inactive'}`);
    });
    
    // Check specific course enrollments
    db.all('SELECT e.*, u.first_name, u.last_name, u.email, u.points FROM enrollments e JOIN users u ON e.student_id = u.id WHERE e.course_id = ?', ['physics'], (err, physicsEnrollments) => {
        if (err) {
            console.error('Error fetching physics enrollments:', err);
            db.close();
            return;
        }
        
        console.log('\n🎯 Physics course enrollments:');
        if (physicsEnrollments.length === 0) {
            console.log('  No enrollments found for course_id = "physics"');
        } else {
            physicsEnrollments.forEach((enrollment, index) => {
                console.log(`  ${index + 1}. ${enrollment.first_name} ${enrollment.last_name} (${enrollment.email}) - Points: ${enrollment.points || 0}`);
            });
        }
        
        // Check what course_id values actually exist
        db.all('SELECT DISTINCT course_id FROM enrollments', (err, courseIds) => {
            if (err) {
                console.error('Error fetching course IDs:', err);
                db.close();
                return;
            }
            
            console.log('\n📚 Available course IDs in enrollments:');
            courseIds.forEach((course, index) => {
                console.log(`  ${index + 1}. "${course.course_id}"`);
            });
            
            db.close();
        });
    });
});
