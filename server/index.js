import express from 'express';
import cors from 'cors';
import path from 'path';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { create } from 'ipfs-http-client';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sqlite = sqlite3.verbose();

const app = express();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'skillcert-dev-secret-key-2025';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types for skill demonstration
    const allowedTypes = /jpeg|jpg|png|gif|pdf|zip|doc|docx|txt|md|js|jsx|ts|tsx|py|html|css|json/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only allowed file types are permitted'));
    }
  }
});

// Initialize IPFS client (using public gateway for demo)
let ipfs;
try {
  ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' });
  console.log('Connected to IPFS via Infura');
} catch (error) {
  console.warn('IPFS connection failed, will use local storage:', error.message);
}

// Database setup
const dbPath = path.join(__dirname, 'skillcert.db');
const db = new sqlite.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'freelancer',
    primary_skill TEXT,
    profile_data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tasks table
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    skill TEXT NOT NULL,
    file_path TEXT,
    ipfs_hash TEXT,
    status TEXT DEFAULT 'pending',
    metadata TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Credentials table (for local metadata, blockchain has the source of truth)
  db.run(`CREATE TABLE IF NOT EXISTS credentials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    blockchain_id INTEGER,
    user_id INTEGER NOT NULL,
    issuer_id INTEGER,
    skill TEXT NOT NULL,
    ipfs_hash TEXT,
    transaction_hash TEXT,
    metadata TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (issuer_id) REFERENCES users (id)
  )`);

  // Create indexes for performance
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_tasks_skill ON tasks(skill)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_credentials_user_id ON credentials(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_credentials_blockchain_id ON credentials(blockchain_id)`);
});

// Middleware for JWT authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'SkillCert Backend API',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      health: '/api/health',
      register: 'POST /api/users/register',
      login: 'POST /api/users/login',
      profile: 'GET /api/users/profile',
      tasks: 'GET /api/tasks',
      credentials: 'GET /api/credentials'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// User registration
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password, primarySkill, role = 'freelancer' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user
    db.run(
      `INSERT INTO users (name, email, password_hash, primary_skill, role) VALUES (?, ?, ?, ?, ?)`,
      [name, email, passwordHash, primarySkill || '', role],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Email already registered' });
          }
          console.error('Registration error:', err);
          return res.status(500).json({ error: 'Registration failed' });
        }

        // Generate JWT token
        const token = jwt.sign(
          { userId: this.lastID, email, role },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        res.status(201).json({
          message: 'User registered successfully',
          token,
          user: {
            id: this.lastID,
            name,
            email,
            primarySkill,
            role
          }
        });
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    db.get(
      `SELECT id, name, email, password_hash, role, primary_skill FROM users WHERE email = ?`,
      [email],
      async (err, user) => {
        if (err) {
          console.error('Login query error:', err);
          return res.status(500).json({ error: 'Login failed' });
        }

        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
          { userId: user.id, email: user.email, role: user.role },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        res.json({
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            primarySkill: user.primary_skill,
            role: user.role
          }
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
app.get('/api/users/profile', authenticateToken, (req, res) => {
  db.get(
    `SELECT id, name, email, role, primary_skill, profile_data, created_at FROM users WHERE id = ?`,
    [req.user.userId],
    (err, user) => {
      if (err) {
        console.error('Profile query error:', err);
        return res.status(500).json({ error: 'Failed to fetch profile' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        user: {
          ...user,
          profile_data: user.profile_data ? JSON.parse(user.profile_data) : {}
        }
      });
    }
  );
});

// Submit task
app.post('/api/tasks/submit', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const { title, description, skill } = req.body;
    const file = req.file;

    if (!title || !skill) {
      return res.status(400).json({ error: 'Title and skill are required' });
    }

    let ipfsHash = null;
    let filePath = null;

    if (file) {
      filePath = file.path;
      
      // Try to upload to IPFS
      if (ipfs) {
        try {
          const fileBuffer = fs.readFileSync(file.path);
          const result = await ipfs.add(fileBuffer);
          ipfsHash = result.path;
          console.log('File uploaded to IPFS:', ipfsHash);
        } catch (ipfsError) {
          console.warn('IPFS upload failed:', ipfsError.message);
          // Continue without IPFS, file stored locally
        }
      }
    }

    // Insert task
    db.run(
      `INSERT INTO tasks (user_id, title, description, skill, file_path, ipfs_hash, status, metadata) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [
        req.user.userId,
        title,
        description || '',
        skill,
        filePath,
        ipfsHash,
        JSON.stringify({
          originalName: file ? file.originalname : null,
          size: file ? file.size : null,
          mimetype: file ? file.mimetype : null
        })
      ],
      function(err) {
        if (err) {
          console.error('Task submission error:', err);
          return res.status(500).json({ error: 'Task submission failed' });
        }

        res.status(201).json({
          message: 'Task submitted successfully',
          taskId: this.lastID,
          ipfsHash
        });
      }
    );
  } catch (error) {
    console.error('Task submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user tasks
app.get('/api/tasks', authenticateToken, (req, res) => {
  db.all(
    `SELECT id, title, description, skill, status, ipfs_hash, created_at, updated_at 
     FROM tasks WHERE user_id = ? ORDER BY created_at DESC`,
    [req.user.userId],
    (err, tasks) => {
      if (err) {
        console.error('Tasks query error:', err);
        return res.status(500).json({ error: 'Failed to fetch tasks' });
      }

      res.json({ tasks });
    }
  );
});

// Get all pending tasks (for educators)
app.get('/api/tasks/pending', authenticateToken, (req, res) => {
  // Only educators can view pending tasks
  if (req.user.role !== 'educator' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  db.all(
    `SELECT t.id, t.title, t.description, t.skill, t.status, t.ipfs_hash, t.created_at,
            u.name as user_name, u.email as user_email
     FROM tasks t 
     JOIN users u ON t.user_id = u.id 
     WHERE t.status = 'pending' 
     ORDER BY t.created_at DESC`,
    (err, tasks) => {
      if (err) {
        console.error('Pending tasks query error:', err);
        return res.status(500).json({ error: 'Failed to fetch pending tasks' });
      }

      res.json({ tasks });
    }
  );
});

// Approve task (for educators)
app.post('/api/tasks/:taskId/approve', authenticateToken, (req, res) => {
  if (req.user.role !== 'educator' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  const taskId = req.params.taskId;

  db.run(
    `UPDATE tasks SET status = 'approved', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [taskId],
    function(err) {
      if (err) {
        console.error('Task approval error:', err);
        return res.status(500).json({ error: 'Task approval failed' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json({ message: 'Task approved successfully' });
    }
  );
});

// Get user credentials
app.get('/api/credentials', authenticateToken, (req, res) => {
  db.all(
    `SELECT id, blockchain_id, skill, ipfs_hash, transaction_hash, metadata, created_at 
     FROM credentials WHERE user_id = ? ORDER BY created_at DESC`,
    [req.user.userId],
    (err, credentials) => {
      if (err) {
        console.error('Credentials query error:', err);
        return res.status(500).json({ error: 'Failed to fetch credentials' });
      }

      res.json({ credentials });
    }
  );
});

// Store credential metadata after blockchain issuance
app.post('/api/credentials', authenticateToken, (req, res) => {
  const { blockchainId, skill, ipfsHash, transactionHash, metadata } = req.body;

  if (!blockchainId || !skill) {
    return res.status(400).json({ error: 'Blockchain ID and skill are required' });
  }

  db.run(
    `INSERT INTO credentials (blockchain_id, user_id, skill, ipfs_hash, transaction_hash, metadata) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [blockchainId, req.user.userId, skill, ipfsHash, transactionHash, JSON.stringify(metadata)],
    function(err) {
      if (err) {
        console.error('Credential storage error:', err);
        return res.status(500).json({ error: 'Failed to store credential' });
      }

      res.status(201).json({
        message: 'Credential stored successfully',
        credentialId: this.lastID
      });
    }
  );
});

// ===== VERIFICATION ENDPOINTS =====

// Verify credential by blockchain ID or hash (public endpoint)
app.get('/api/verify/:identifier', (req, res) => {
  const identifier = req.params.identifier;
  
  // Search by blockchain_id or transaction_hash
  db.get(
    `SELECT c.*, u.name as user_name, u.email as user_email
     FROM credentials c 
     LEFT JOIN users u ON c.user_id = u.id 
     WHERE c.blockchain_id = ? OR c.transaction_hash = ?`,
    [identifier, identifier],
    (err, credential) => {
      if (err) {
        console.error('Verification query error:', err);
        return res.status(500).json({ error: 'Verification failed' });
      }

      if (!credential) {
        return res.status(404).json({ 
          success: false,
          error: 'Credential not found',
          isValid: false
        });
      }

      res.json({
        success: true,
        isValid: true,
        credential: {
          id: credential.blockchain_id,
          skill: credential.skill,
          user_name: credential.user_name,
          created_at: credential.created_at,
          blockchain_id: credential.blockchain_id,
          ipfs_hash: credential.ipfs_hash
        }
      });
    }
  );
});

// Get all credentials for a user by email or wallet (public endpoint for employers)
app.get('/api/verify/user/:identifier', (req, res) => {
  const identifier = req.params.identifier;
  
  // Search by email (assuming wallet address would be stored in profile_data)
  db.all(
    `SELECT c.*, u.name as user_name, u.email as user_email
     FROM credentials c 
     JOIN users u ON c.user_id = u.id 
     WHERE u.email = ? OR JSON_EXTRACT(u.profile_data, '$.walletAddress') = ?
     ORDER BY c.created_at DESC`,
    [identifier, identifier],
    (err, credentials) => {
      if (err) {
        console.error('User credentials query error:', err);
        return res.status(500).json({ error: 'Query failed' });
      }

      if (!credentials || credentials.length === 0) {
        return res.status(404).json({ 
          success: false,
          error: 'No credentials found for this user'
        });
      }

      res.json({
        success: true,
        credentials: credentials.map(c => ({
          id: c.blockchain_id,
          skill: c.skill,
          created_at: c.created_at,
          blockchain_id: c.blockchain_id,
          ipfs_hash: c.ipfs_hash
        })),
        userInfo: {
          name: credentials[0].user_name,
          email: credentials[0].user_email
        }
      });
    }
  );
});

// ===== PROFILE MANAGEMENT ENDPOINTS =====

// Update user profile
app.put('/api/users/profile', authenticateToken, (req, res) => {
  const { name, primarySkill, profileData } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  db.run(
    `UPDATE users SET name = ?, primary_skill = ?, profile_data = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [name, primarySkill, JSON.stringify(profileData || {}), req.user.userId],
    function(err) {
      if (err) {
        console.error('Profile update error:', err);
        return res.status(500).json({ error: 'Profile update failed' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ 
        success: true,
        message: 'Profile updated successfully' 
      });
    }
  );
});

// Update user password
app.put('/api/users/password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new passwords are required' });
  }

  try {
    // Get current user
    db.get(
      `SELECT password_hash FROM users WHERE id = ?`,
      [req.user.userId],
      async (err, user) => {
        if (err || !user) {
          return res.status(500).json({ error: 'User not found' });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isCurrentPasswordValid) {
          return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const saltRounds = 12;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        db.run(
          `UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [newPasswordHash, req.user.userId],
          function(err) {
            if (err) {
              console.error('Password update error:', err);
              return res.status(500).json({ error: 'Password update failed' });
            }

            res.json({ 
              success: true,
              message: 'Password updated successfully' 
            });
          }
        );
      }
    );
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user preferences
app.put('/api/users/preferences', authenticateToken, (req, res) => {
  const preferences = req.body;

  db.get(
    `SELECT profile_data FROM users WHERE id = ?`,
    [req.user.userId],
    (err, user) => {
      if (err || !user) {
        return res.status(500).json({ error: 'User not found' });
      }

      const currentProfileData = user.profile_data ? JSON.parse(user.profile_data) : {};
      const updatedProfileData = {
        ...currentProfileData,
        preferences: preferences
      };

      db.run(
        `UPDATE users SET profile_data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [JSON.stringify(updatedProfileData), req.user.userId],
        function(err) {
          if (err) {
            console.error('Preferences update error:', err);
            return res.status(500).json({ error: 'Preferences update failed' });
          }

          res.json({ 
            success: true,
            message: 'Preferences updated successfully' 
          });
        }
      );
    }
  );
});

// Export user data
app.get('/api/users/export', authenticateToken, (req, res) => {
  // Get user data
  db.get(
    `SELECT id, name, email, role, primary_skill, profile_data, created_at FROM users WHERE id = ?`,
    [req.user.userId],
    (err, user) => {
      if (err || !user) {
        return res.status(500).json({ error: 'User not found' });
      }

      // Get user tasks
      db.all(
        `SELECT title, description, skill, status, created_at FROM tasks WHERE user_id = ?`,
        [req.user.userId],
        (err, tasks) => {
          if (err) {
            console.error('Tasks export error:', err);
            tasks = [];
          }

          // Get user credentials
          db.all(
            `SELECT blockchain_id, skill, created_at FROM credentials WHERE user_id = ?`,
            [req.user.userId],
            (err, credentials) => {
              if (err) {
                console.error('Credentials export error:', err);
                credentials = [];
              }

              const exportData = {
                user: {
                  ...user,
                  profile_data: user.profile_data ? JSON.parse(user.profile_data) : {}
                },
                tasks: tasks,
                credentials: credentials,
                exportedAt: new Date().toISOString()
              };

              res.json({ 
                success: true,
                data: exportData 
              });
            }
          );
        }
      );
    }
  );
});

// ===== EDUCATOR SPECIFIC ENDPOINTS =====

// Create new task (for educators)
app.post('/api/educator/tasks', authenticateToken, (req, res) => {
  if (req.user.role !== 'educator' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  const { title, description, skill, requirements, difficulty } = req.body;

  if (!title || !skill) {
    return res.status(400).json({ error: 'Title and skill are required' });
  }

  db.run(
    `INSERT INTO tasks (user_id, title, description, skill, status, metadata) 
     VALUES (?, ?, ?, ?, 'template', ?)`,
    [
      req.user.userId,
      title,
      description || '',
      skill,
      JSON.stringify({
        type: 'educator_created',
        requirements: requirements || '',
        difficulty: difficulty || 'intermediate',
        creator: req.user.email
      })
    ],
    function(err) {
      if (err) {
        console.error('Educator task creation error:', err);
        return res.status(500).json({ error: 'Task creation failed' });
      }

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        taskId: this.lastID
      });
    }
  );
});

// Get educator's created tasks
app.get('/api/educator/tasks', authenticateToken, (req, res) => {
  if (req.user.role !== 'educator' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  db.all(
    `SELECT id, title, description, skill, status, metadata, created_at, updated_at 
     FROM tasks WHERE user_id = ? AND JSON_EXTRACT(metadata, '$.type') = 'educator_created'
     ORDER BY created_at DESC`,
    [req.user.userId],
    (err, tasks) => {
      if (err) {
        console.error('Educator tasks query error:', err);
        return res.status(500).json({ error: 'Failed to fetch tasks' });
      }

      const formattedTasks = tasks.map(task => ({
        ...task,
        metadata: task.metadata ? JSON.parse(task.metadata) : {}
      }));

      res.json({ 
        success: true,
        tasks: formattedTasks 
      });
    }
  );
});

// Get pending submissions for review
app.get('/api/educator/submissions', authenticateToken, (req, res) => {
  if (req.user.role !== 'educator' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  db.all(
    `SELECT t.id, t.title, t.description, t.skill, t.status, t.ipfs_hash, t.created_at, t.file_path,
            u.name as user_name, u.email as user_email, u.id as user_id
     FROM tasks t 
     JOIN users u ON t.user_id = u.id 
     WHERE t.status = 'pending' AND (JSON_EXTRACT(t.metadata, '$.type') IS NULL OR JSON_EXTRACT(t.metadata, '$.type') != 'educator_created')
     ORDER BY t.created_at ASC`,
    (err, submissions) => {
      if (err) {
        console.error('Submissions query error:', err);
        return res.status(500).json({ error: 'Failed to fetch submissions' });
      }

      res.json({ 
        success: true,
        submissions: submissions 
      });
    }
  );
});

// Approve a submission and issue credential
app.post('/api/educator/submissions/:submissionId/approve', authenticateToken, async (req, res) => {
  if (req.user.role !== 'educator' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  const submissionId = req.params.submissionId;
  const { feedback = '' } = req.body;

  try {
    // Get submission details first
    db.get(
      `SELECT t.*, u.email as user_email, u.name as user_name 
       FROM tasks t 
       JOIN users u ON t.user_id = u.id 
       WHERE t.id = ?`,
      [submissionId],
      function(err, submission) {
        if (err || !submission) {
          return res.status(404).json({ error: 'Submission not found' });
        }

        // Update task status to approved
        db.run(
          `UPDATE tasks SET status = 'approved', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [submissionId],
          function(err) {
            if (err) {
              console.error('Submission approval error:', err);
              return res.status(500).json({ error: 'Approval failed' });
            }

            // Auto-create a credential entry (blockchain integration would happen here)
            const mockBlockchainId = Date.now() + Math.floor(Math.random() * 1000);
            const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;

            db.run(
              `INSERT INTO credentials (blockchain_id, user_id, issuer_id, skill, ipfs_hash, transaction_hash, metadata) 
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                mockBlockchainId,
                submission.user_id,
                req.user.userId,
                submission.skill,
                submission.ipfs_hash,
                mockTxHash,
                JSON.stringify({
                  taskId: submission.id,
                  taskTitle: submission.title,
                  approvedBy: req.user.email,
                  feedback: feedback,
                  approvedAt: new Date().toISOString()
                })
              ],
              function(credErr) {
                if (credErr) {
                  console.error('Credential creation error:', credErr);
                  // Don't fail the approval if credential creation fails
                }

                res.json({
                  success: true,
                  message: 'Submission approved successfully',
                  credentialIssued: !credErr,
                  blockchainId: mockBlockchainId
                });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.error('Approval process error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reject a submission
app.post('/api/educator/submissions/:submissionId/reject', authenticateToken, (req, res) => {
  if (req.user.role !== 'educator' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  const submissionId = req.params.submissionId;
  const { feedback } = req.body;

  if (!feedback) {
    return res.status(400).json({ error: 'Feedback is required for rejection' });
  }

  db.run(
    `UPDATE tasks SET status = 'rejected', metadata = JSON_SET(COALESCE(metadata, '{}'), '$.rejection_feedback', ?), updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [feedback, submissionId],
    function(err) {
      if (err) {
        console.error('Submission rejection error:', err);
        return res.status(500).json({ error: 'Rejection failed' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      res.json({
        success: true,
        message: 'Submission rejected successfully'
      });
    }
  );
});

// Get educator's students (users who have submitted tasks)
app.get('/api/educator/students', authenticateToken, (req, res) => {
  if (req.user.role !== 'educator' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  db.all(
    `SELECT DISTINCT u.id, u.name, u.email, u.primary_skill, u.created_at,
            COUNT(t.id) as total_submissions,
            COUNT(CASE WHEN t.status = 'approved' THEN 1 END) as approved_submissions,
            COUNT(CASE WHEN t.status = 'pending' THEN 1 END) as pending_submissions
     FROM users u 
     JOIN tasks t ON u.id = t.user_id 
     WHERE (JSON_EXTRACT(t.metadata, '$.type') IS NULL OR JSON_EXTRACT(t.metadata, '$.type') != 'educator_created')
     GROUP BY u.id, u.name, u.email, u.primary_skill, u.created_at
     ORDER BY total_submissions DESC`,
    (err, students) => {
      if (err) {
        console.error('Students query error:', err);
        return res.status(500).json({ error: 'Failed to fetch students' });
      }

      res.json({ 
        success: true,
        students: students 
      });
    }
  );
});

// Get IPFS file
app.get('/api/ipfs/:hash', async (req, res) => {
  try {
    const hash = req.params.hash;
    
    if (!ipfs) {
      return res.status(503).json({ error: 'IPFS not available' });
    }

    const stream = ipfs.cat(hash);
    let data = Buffer.alloc(0);

    for await (const chunk of stream) {
      data = Buffer.concat([data, chunk]);
    }

    res.send(data);
  } catch (error) {
    console.error('IPFS retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve file from IPFS' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`SkillCert backend server running on port ${PORT}`);
  console.log('Database initialized successfully');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});