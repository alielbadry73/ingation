const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

console.log('🔍 Checking courses table...');

// Check if courses table exists
db.all('SELECT name FROM sqlite_master WHERE type="table" AND name="courses"', (err, rows) => {
    if (err) {
        console.error('Error checking courses table:', err);
        db.close();
        return;
    }
    
    if (rows.length === 0) {
        console.log('❌ Courses table does not exist');
        db.close();
        return;
    }
    
    // Check all courses
    db.all('SELECT * FROM courses', (err, courses) => {
        if (err) {
            console.error('Error fetching courses:', err);
            db.close();
            return;
        }
        
        console.log('📚 All courses:');
        courses.forEach((course, index) => {
            console.log(`  ${index + 1}. ID: ${course.id}, Title: "${course.title}", Level: "${course.level || 'N/A'}"`);
        });
        
        db.close();
    });
});
