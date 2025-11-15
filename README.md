## Local MySQL Setup Guide

1. **Install MySQL**:  
   Download from https://dev.mysql.com/downloads/installer/ and install.

2. **Create a database and user**:  
   (Open MySQL terminal/Workbench)

CREATE DATABASE leavemanagement;
CREATE USER 'youruser'@'localhost' IDENTIFIED BY 'yourpassword';
GRANT ALL PRIVILEGES ON leavemanagement.* TO 'youruser'@'localhost';

3. **Run the setup script** (from your project folder):  
mysql -u youruser -p leavemanagement < setup.sql

(enter your password when prompted)

4. **Edit `/config/db.js`** (or your DB config file):  
module.exports = {
host: 'localhost',
user: 'youruser',
password: 'yourpassword',
database: 'leavemanagement'
}

(You can also support `.env` option to avoid editing files.)

5. **Run the project as usual.**

---

## 3. **Remove hardcoded values from code**

Check your database config (e.g., `/config/db.js`) and make sure it uses variables that users can easily set (don’t hardcode your username/password).

---

## 4. **Test It Like a New User**

- Run the setup on a fresh MySQL install with a new user (if possible).
- If errors, update setup.sql or README accordingly.

---

## 5. **Commit to GitHub**

- Add `setup.sql` and commit your updated README/config.
