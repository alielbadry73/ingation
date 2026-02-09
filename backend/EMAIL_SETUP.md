# Email Configuration Guide

The forgot password feature is **already implemented** and working! It just needs SMTP configuration to send real emails.

## Current Status

✅ **Forgot Password Flow**: Fully implemented
✅ **Email Templates**: Ready to use
✅ **Verification Codes**: Generated and stored in database
✅ **Development Mode**: Shows codes in alerts when SMTP not configured

## Quick Setup (Gmail - Recommended)

### Step 1: Enable Gmail App Passwords

1. Go to your Google Account: https://myaccount.google.com/security
2. Enable **2-Step Verification** (required for app passwords)
3. Go to App Passwords: https://myaccount.google.com/apppasswords
4. Select **Mail** and **Other (Custom name)**
5. Name it "IG Nation Platform"
6. Click **Generate**
7. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 2: Update .env File

Open `backend/.env` and update these lines:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-actual-email@gmail.com
SMTP_PASS=abcdefghijklmnop
SMTP_FROM=your-actual-email@gmail.com
```

**Important**: Remove spaces from the app password!

### Step 3: Restart the Server

```bash
cd backend
npm start
```

You should see: `✅ SMTP transporter ready`

## Testing

1. Go to the login page
2. Click "Forgot Password?"
3. Enter an email address that exists in your database
4. Click "Send Verification Code"
5. Check the email inbox - you should receive a 6-digit code
6. Enter the code and reset your password

## Alternative Email Providers

### Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
SMTP_FROM=your-email@outlook.com
```

### Yahoo Mail

```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@yahoo.com
```

**Note**: Yahoo also requires app passwords. Generate one at: https://login.yahoo.com/account/security

### Custom SMTP Server

```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-password
SMTP_FROM=noreply@yourdomain.com
```

## Development Mode

If SMTP is not configured, the system will:
- ✅ Still generate verification codes
- ✅ Store them in the database
- ✅ Show the code in an alert popup
- ✅ Log the email content to the console

This allows you to test the forgot password flow without email setup!

## Troubleshooting

### "SMTP transporter error"

- Check your email and password are correct
- For Gmail, make sure you're using an **app password**, not your regular password
- Check that 2-Step Verification is enabled
- Remove any spaces from the app password

### "Failed to send email"

- Check your internet connection
- Verify the SMTP host and port are correct
- Check if your email provider requires app passwords
- Look at the server console for detailed error messages

### Email not received

- Check spam/junk folder
- Verify the email address exists in your database
- Check server console for "Password reset email" logs
- Try with a different email provider

## Security Notes

- Never commit `.env` file to git (it's in `.gitignore`)
- Use app passwords instead of regular passwords
- Change `JWT_SECRET` to a random string in production
- Consider using a dedicated email service like SendGrid or Mailgun for production

## Email Template

The system sends a professional email with:
- 6-digit verification code
- Direct reset link (auto-fills email and code)
- Clear instructions
- Security notice

Example:
```
Subject: Password reset for your account

We received a request to reset your password.

Verification code: 123456

Or click the link: http://localhost:3000/?reset_email=user@example.com&reset_code=123456

If you didn't request this, ignore this message.
```

## Need Help?

The forgot password feature is fully functional. Just configure SMTP and it will work immediately!
