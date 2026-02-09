const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

console.log('🗑️  Clearing all teacher data...\n');

// First, show current teachers
db.all('SELECT id, email, first_name, last_name, subject FROM teachers', (err, rows) => {
    if (err) {
        console.error('❌ Error querying teachers:', err);
        db.close();
        return;
    }
    
    console.log(`📋 Current teachers in database: ${rows.length}`);
    if (rows.length > 0) {
        console.log(JSON.stringify(rows, null, 2));
        console.log('\n');
    }
    
    // Delete all teachers
    db.run('DELETE FROM teachers', function(err) {
        if (err) {
            console.error('❌ Error deleting teachers:', err);
            db.close();
            return;
        }
        
        console.log(`✅ Successfully deleted ${this.changes} teacher(s)`);
        
        // Verify deletion
        db.all('SELECT COUNT(*) as count FROM teachers', (err, result) => {
            if (err) {
                console.error('❌ Error verifying deletion:', err);
            } else {
                console.log(`📊 Teachers remaining: ${result[0].count}`);
            }
            db.close();
        });
    });
});
