const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Creating enrollments from approved orders...\n');

// Get all approved orders for user 11
db.all('SELECT * FROM orders WHERE customer_email = ? AND status = ?', 
    ['alielbadry279@gmail.com', 'approved'], 
    (err, orders) => {
        if (err) {
            console.error('Error querying orders:', err);
            process.exit(1);
        }
        
        console.log(`Found ${orders.length} approved orders\n`);
        
        let totalCourses = 0;
        let processedOrders = 0;
        
        orders.forEach(order => {
            try {
                const courses = JSON.parse(order.courses);
                console.log(`Order ${order.id}: ${courses.length} courses`);
                
                courses.forEach(course => {
                    const courseId = course.courseId || course.id;
                    console.log(`  - Creating enrollment for course ${courseId}: ${course.title}`);
                    
                    // Check if enrollment already exists
                    db.get('SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?',
                        [11, courseId],
                        (err, existing) => {
                            if (err) {
                                console.error('    Error checking enrollment:', err);
                                return;
                            }
                            
                            if (existing) {
                                console.log('    ✓ Enrollment already exists');
                            } else {
                                // Create enrollment
                                db.run(`INSERT INTO enrollments (student_id, course_id, granted_by_admin, is_active, created_at)
                                        VALUES (?, ?, 1, 1, datetime('now'))`,
                                    [11, courseId],
                                    function(err) {
                                        if (err) {
                                            console.error('    ✗ Error creating enrollment:', err);
                                        } else {
                                            console.log('    ✓ Enrollment created successfully');
                                            totalCourses++;
                                        }
                                    }
                                );
                            }
                        }
                    );
                });
                
                processedOrders++;
                
                if (processedOrders === orders.length) {
                    // Wait a bit for all inserts to complete
                    setTimeout(() => {
                        // Verify enrollments
                        db.get('SELECT COUNT(*) as count FROM enrollments WHERE student_id = ?',
                            [11],
                            (err, result) => {
                                if (err) {
                                    console.error('Error counting enrollments:', err);
                                } else {
                                    console.log(`\n✅ Total enrollments for user 11: ${result.count}`);
                                }
                                db.close();
                            }
                        );
                    }, 1000);
                }
            } catch (e) {
                console.error(`Error parsing courses for order ${order.id}:`, e);
            }
        });
    }
);
