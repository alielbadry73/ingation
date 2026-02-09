const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

console.log('🔍 Debugging Ali ElBadry points and enrollment...');

// Get user info with points
db.get('SELECT id, first_name, last_name, email, points FROM users WHERE email = ?', ['alielbadry279@gmail.com'], (err, user) => {
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
    
    console.log('✅ User info:');
    console.log(`  Name: ${user.first_name} ${user.last_name}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  User ID: ${user.id}`);
    console.log(`  Points: ${user.points || 0}`);
    
    // Check enrollment
    db.get('SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?', [user.id, 1], (err, enrollment) => {
        if (err) {
            console.error('Error checking enrollment:', err);
            db.close();
            return;
        }
        
        console.log('\n📚 Physics enrollment:');
        if (!enrollment) {
            console.log('  ❌ No enrollment found');
        } else {
            console.log(`  ✅ Enrollment ID: ${enrollment.id}`);
            console.log(`  Course ID: ${enrollment.course_id}`);
            console.log(`  Is Active: ${enrollment.is_active}`);
            console.log(`  Created: ${enrollment.created_at}`);
        }
        
        // Test the exact query used in the API
        console.log('\n🔍 Testing API query...');
        const query = `
            SELECT 
                u.id,
                u.first_name,
                u.last_name,
                u.email,
                u.points,
                e.created_at as enrolled_date
            FROM enrollments e
            JOIN users u ON e.student_id = u.id
            WHERE e.course_id = ? AND e.is_active = 1
            ORDER BY u.points DESC
        `;
        
        db.all(query, [1], (err, rows) => {
            if (err) {
                console.error('Error in API query:', err);
                db.close();
                return;
            }
            
            console.log('📊 API query results:');
            if (rows.length === 0) {
                console.log('  No results');
            } else {
                rows.forEach((row, index) => {
                    console.log(`  ${index + 1}. ${row.first_name} ${row.last_name} - Points: ${row.points || 0}`);
                });
            }
            
            db.close();
        });
    });
});
