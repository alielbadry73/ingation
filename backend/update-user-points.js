const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

console.log('🔧 Updating Ali ElBadry points to match earned points...');

// Calculate Ali's actual points from assignments
db.all('SELECT * FROM physicsAssessments WHERE user_id = ? AND (status = "graded" OR status = "completed")', [16], (err, assignments) => {
    if (err) {
        console.error('Error fetching assignments:', err);
        db.close();
        return;
    }
    
    console.log('📚 Ali\'s assignments:');
    let totalPoints = 0;
    
    assignments.forEach((assignment, index) => {
        const points = assignment.finalScore || assignment.score || 0;
        totalPoints += points;
        console.log(`  ${index + 1}. ${assignment.title} - Points: ${points} (Status: ${assignment.status})`);
    });
    
    console.log(`\n📊 Total calculated points: ${totalPoints}`);
    
    // Update the user's points in the database
    db.run('UPDATE users SET points = ? WHERE id = ?', [totalPoints, 16], (err) => {
        if (err) {
            console.error('Error updating points:', err);
            db.close();
            return;
        }
        
        console.log(`✅ Updated user points to: ${totalPoints}`);
        
        // Verify the update
        db.get('SELECT id, first_name, last_name, points FROM users WHERE id = ?', [16], (err, user) => {
            if (err) {
                console.error('Error verifying update:', err);
                db.close();
                return;
            }
            
            console.log('\n✅ Verification:');
            console.log(`  Name: ${user.first_name} ${user.last_name}`);
            console.log(`  Updated Points: ${user.points}`);
            
            // Test the API query again
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
                
                console.log('\n📊 Updated API query results:');
                rows.forEach((row, index) => {
                    console.log(`  ${index + 1}. ${row.first_name} ${row.last_name} - Points: ${row.points || 0}`);
                });
                
                console.log('\n🎉 Ali ElBadry should now show 17 points in the leaderboard!');
                db.close();
            });
        });
    });
});
