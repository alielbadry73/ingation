// Test Email Configuration
// Run this script to test if your SMTP settings are working
// Usage: node test-email.js your-test-email@example.com

require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = process.argv[2];

if (!testEmail) {
    console.error('❌ Please provide a test email address');
    console.log('Usage: node test-email.js your-email@example.com');
    process.exit(1);
}

console.log('🔍 Checking SMTP configuration...\n');

// Check if SMTP is configured
if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.error('❌ SMTP not configured!');
    console.log('\nPlease update your .env file with:');
    console.log('  SMTP_HOST=smtp.gmail.com');
    console.log('  SMTP_USER=your-email@gmail.com');
    console.log('  SMTP_PASS=your-app-password');
    console.log('\nSee EMAIL_SETUP.md for detailed instructions.');
    process.exit(1);
}

console.log('✅ SMTP configuration found:');
console.log(`   Host: ${process.env.SMTP_HOST}`);
console.log(`   Port: ${process.env.SMTP_PORT || 587}`);
console.log(`   User: ${process.env.SMTP_USER}`);
console.log(`   From: ${process.env.SMTP_FROM || process.env.SMTP_USER}`);
console.log('');

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

console.log('🔌 Testing SMTP connection...');

// Verify connection
transporter.verify()
    .then(() => {
        console.log('✅ SMTP connection successful!\n');
        
        // Send test email
        console.log(`📧 Sending test email to ${testEmail}...`);
        
        const testCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        return transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: testEmail,
            subject: 'Test Email - IG Nation Platform',
            text: `This is a test email from IG Nation Platform.\n\nYour test verification code is: ${testCode}\n\nIf you received this email, your SMTP configuration is working correctly!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #667eea;">✅ Test Email Successful!</h2>
                    <p>This is a test email from <strong>IG Nation Platform</strong>.</p>
                    <div style="background: #f0f9ff; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Test Verification Code:</strong></p>
                        <h1 style="color: #667eea; margin: 10px 0; font-size: 32px; letter-spacing: 5px;">${testCode}</h1>
                    </div>
                    <p>If you received this email, your SMTP configuration is working correctly!</p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                    <p style="color: #64748b; font-size: 14px;">
                        This is an automated test email. You can now use the forgot password feature.
                    </p>
                </div>
            `
        });
    })
    .then((info) => {
        console.log('✅ Test email sent successfully!');
        console.log(`   Message ID: ${info.messageId}`);
        console.log(`\n📬 Check your inbox at: ${testEmail}`);
        console.log('   (Don\'t forget to check spam/junk folder)\n');
        console.log('🎉 Your SMTP configuration is working! The forgot password feature is ready to use.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Error:', error.message);
        console.log('\n💡 Common issues:');
        console.log('   • Gmail: Make sure you\'re using an app password, not your regular password');
        console.log('   • Gmail: Enable 2-Step Verification first');
        console.log('   • Check that SMTP_USER and SMTP_PASS are correct');
        console.log('   • Remove any spaces from the app password');
        console.log('\nSee EMAIL_SETUP.md for detailed troubleshooting.');
        process.exit(1);
    });
