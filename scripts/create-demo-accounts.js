import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sqlite = sqlite3.verbose();
const dbPath = path.join(__dirname, '..', 'server', 'skillcert.db');

console.log('Creating demo accounts...');

const db = new sqlite.Database(dbPath);

// Demo accounts with pre-hashed passwords (all use password: "demo123")
const demoAccounts = [
  {
    name: 'Alex Freelancer',
    email: 'freelancer@demo.skillcert',
    password: 'demo123',
    role: 'freelancer',
    primarySkill: 'React Development'
  },
  {
    name: 'Dr. Sarah Educator',
    email: 'educator@demo.skillcert',
    password: 'demo123',
    role: 'educator',
    primarySkill: 'Computer Science'
  },
  {
    name: 'Mike Employer',
    email: 'employer@demo.skillcert',
    password: 'demo123',
    role: 'employer',
    primarySkill: 'Talent Acquisition'
  },
  {
    name: 'Admin User',
    email: 'admin@demo.skillcert',
    password: 'demo123',
    role: 'admin',
    primarySkill: 'Platform Management'
  }
];

async function createDemoAccounts() {
  try {
    for (const account of demoAccounts) {
      // Hash the password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(account.password, saltRounds);
      
      // Check if account already exists
      const existingUser = await new Promise((resolve, reject) => {
        db.get(
          'SELECT id FROM users WHERE email = ?',
          [account.email],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });

      if (existingUser) {
        console.log(`✓ Demo account already exists: ${account.email}`);
        continue;
      }

      // Insert the demo account
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO users (name, email, password_hash, primary_skill, role) VALUES (?, ?, ?, ?, ?)`,
          [account.name, account.email, passwordHash, account.primarySkill, account.role],
          function(err) {
            if (err) {
              reject(err);
            } else {
              console.log(`✓ Created demo account: ${account.email} (${account.role})`);
              resolve(this.lastID);
            }
          }
        );
      });
    }

    console.log('\n🎉 All demo accounts created successfully!');
    console.log('\nDemo Credentials:');
    console.log('==================');
    demoAccounts.forEach(account => {
      console.log(`${account.role.toUpperCase().padEnd(12)} | Email: ${account.email.padEnd(25)} | Password: ${account.password}`);
    });
    
  } catch (error) {
    console.error('Error creating demo accounts:', error);
  } finally {
    db.close();
  }
}

createDemoAccounts();