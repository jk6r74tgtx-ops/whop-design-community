const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
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
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Database setup
const db = new sqlite3.Database('designs.db');

// Initialize database tables
db.serialize(() => {
  // Categories table
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Designs table
  db.run(`CREATE TABLE IF NOT EXISTS designs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    username TEXT NOT NULL,
    status TEXT DEFAULT 'approved',
    votes_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories (id)
  )`);

  // Insert default categories
  const defaultCategories = [
    'T-Shirts',
    'Hoodies',
    'Sticker',
    'Poster',
    'Tassen',
    'Sonstiges'
  ];

  defaultCategories.forEach(category => {
    db.run(`INSERT OR IGNORE INTO categories (name) VALUES (?)`, [category]);
  });
});

// Routes

// Categories routes
app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories ORDER BY name', (err, categories) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(categories);
  });
});

// Designs routes
app.get('/api/designs', (req, res) => {
  const { category, status } = req.query;
  let query = `
    SELECT d.*, c.name as category_name 
    FROM designs d 
    JOIN categories c ON d.category_id = c.id 
  `;
  const params = [];

  if (category) {
    query += ' WHERE d.category_id = ?';
    params.push(category);
  }

  if (status) {
    query += params.length ? ' AND d.status = ?' : ' WHERE d.status = ?';
    params.push(status);
  }

  query += ' ORDER BY d.created_at DESC';

  db.all(query, params, (err, designs) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(designs);
  });
});

app.post('/api/designs', upload.single('image'), (req, res) => {
  const { title, description, category_id, username } = req.body;

  if (!title || !category_id || !req.file) {
    return res.status(400).json({ error: 'Title, category, and image are required' });
  }

  const image_url = `/uploads/${req.file.filename}`;

  db.run(
    'INSERT INTO designs (title, description, image_url, category_id, username) VALUES (?, ?, ?, ?, ?)',
    [title, description, image_url, category_id, username || 'Anonymous'],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ 
        id: this.lastID, 
        title, 
        description, 
        image_url, 
        category_id,
        username: username || 'Anonymous',
        status: 'approved'
      });
    }
  );
});

// Voting routes (no authentication required)
app.post('/api/designs/:id/vote', (req, res) => {
  const designId = req.params.id;

  // Simply increment vote count without user tracking
  db.run(
    'UPDATE designs SET votes_count = votes_count + 1 WHERE id = ?',
    [designId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Design not found' });
      }
      
      res.json({ message: 'Vote recorded successfully' });
    }
  );
});

// Get top designs for production
app.get('/api/designs/top', (req, res) => {
  const { limit = 10 } = req.query;
  
  db.all(`
    SELECT d.*, c.name as category_name 
    FROM designs d 
    JOIN categories c ON d.category_id = c.id
    WHERE d.status = 'approved'
    ORDER BY d.votes_count DESC, d.created_at DESC
    LIMIT ?
  `, [limit], (err, designs) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(designs);
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;