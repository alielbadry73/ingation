const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

console.log('🔧 Updating Ali ElBadry points to 17 (based on dashboard calculation)...');

// Update the user's points directly
db.run('UPDATE users SET points = ? WHERE id = ?', [17, 16], (err) => {
    if (err) {
        console.error('Error updating points:', err);
        db.close();
        return;
    }
    
    console.log('✅ Updated user points to: 17');
    
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
        
        // Test the API query
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
            
            console.log('\n📊 API query results:');
            rows.forEach((row, index) => {
                console.log(`  ${index + 1}. ${row.first_name} ${row.last_name} - Points: ${row.points || 0}`);
            });
            
            console.log('\n🎉 Ali ElBadry should now show 17 points in the leaderboard!');
            console.log('🔄 Refresh the physics dashboard to see the updated points!');
            db.close();
        });
    });
});
