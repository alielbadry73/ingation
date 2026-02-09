const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Checking enrollments for user ID 11...\n');

// Check enrollments table schema
db.all("PRAGMA table_info(enrollments)", (err, columns) => {
    if (err) {
        console.error('Error getting table info:', err);
        process.exit(1);
    }
    
    console.log('Enrollments table columns:');
    columns.forEach(col => {
        console.log(`  - ${col.name} (${col.type})`);
    });
    
    // Check all enrollments for user 11
    db.all('SELECT * FROM enrollments WHERE student_id = 11', (err, enrollments) => {
        if (err) {
            console.error('Error querying enrollments:', err);
        } else {
            console.log(`\nEnrollments with student_id = 11: ${enrollments.length}`);
            enrollments.forEach(e => {
                console.log(JSON.stringify(e, null, 2));
            });
        }
        
        // Check orders for user 11
        db.all('SELECT * FROM orders WHERE customer_email = ?', ['alielbadry279@gmail.com'], (err, orders) => {
            if (err) {
                console.error('Error querying orders:', err);
            } else {
                console.log(`\n\nOrders for alielbadry279@gmail.com: ${orders.length}`);
                orders.forEach(o => {
                    console.log(`\nOrder ID: ${o.id}, Status: ${o.status}`);
                    console.log(`Courses: ${o.courses}`);
                });
            }
            
            db.close();
        });
    });
});
