# Admin login credentials (5 users)

Use these to sign in at **http://localhost:3000/admin-login.html**.

| # | Email | Password |
|---|--------|----------|
| 1 | admin1@ignation.com | Admin1#Secure |
| 2 | admin2@ignation.com | Admin2#Secure |
| 3 | admin3@ignation.com | Admin3#Secure |
| 4 | admin4@ignation.com | Admin4#Secure |
| 5 | admin5@ignation.com | Admin5#Secure |

---

**Add these users to the database** (run once from project root or backend folder):

```bash
cd backend
node create-admin-credentials.js
```

After running the script, you can log in with any of the 5 emails and passwords above.

**Security:** Change these passwords in production. Do not commit this file to a public repo if you use it for real credentials.
