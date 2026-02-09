const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

console.log('🔧 Creating basic courses...');

const courses = [
    { id: 1, title: 'Physics IGCSE', level: 'IGCSE', description: 'Complete Physics course for IGCSE students' },
    { id: 2, title: 'Chemistry IGCSE', level: 'IGCSE', description: 'Complete Chemistry course for IGCSE students' },
    { id: 3, title: 'Mathematics IGCSE', level: 'IGCSE', description: 'Complete Mathematics course for IGCSE students' },
    { id: 4, title: 'English IGCSE', level: 'IGCSE', description: 'Complete English course for IGCSE students' }
];

// Create courses table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    level TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
    if (err) {
        console.error('Error creating courses table:', err);
        db.close();
        return;
    }
    
    console.log('✅ Courses table ready');
    
    // Insert or update courses
    let completed = 0;
    courses.forEach(course => {
        db.run(`INSERT OR REPLACE INTO courses (id, title, level, description) VALUES (?, ?, ?, ?)`,
            [course.id, course.title, course.level, course.description],
            (err) => {
                if (err) {
                    console.error(`Error inserting course ${course.id}:`, err);
                } else {
                    console.log(`✅ Created/updated course: ${course.title} (ID: ${course.id})`);
                }
                
                completed++;
                if (completed === courses.length) {
                    console.log('\n🎉 All courses created successfully!');
                    
                    // Show final courses
                    db.all('SELECT * FROM courses ORDER BY id', (err, allCourses) => {
                        if (err) {
                            console.error('Error fetching courses:', err);
                        } else {
                            console.log('\n📚 Final courses list:');
                            allCourses.forEach((course, index) => {
                                console.log(`  ${index + 1}. ID: ${course.id} - ${course.title} (${course.level})`);
                            });
                        }
                        db.close();
                    });
                }
            }
        );
    });
});
