const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/build')));

// In-memory storage for simplicity
let designs = [];
let categories = [
  { id: 1, name: 'T-Shirts' },
  { id: 2, name: 'Hoodies' },
  { id: 3, name: 'Sticker' },
  { id: 4, name: 'Poster' },
  { id: 5, name: 'Tassen' },
  { id: 6, name: 'Sonstiges' }
];

let nextId = 1;

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Routes

// Categories routes
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

// Designs routes
app.get('/api/designs', (req, res) => {
  const { category, status } = req.query;
  let filteredDesigns = [...designs];

  if (category) {
    filteredDesigns = filteredDesigns.filter(d => d.category_id == category);
  }

  if (status) {
    filteredDesigns = filteredDesigns.filter(d => d.status === status);
  }

  // Add category names
  const designsWithCategories = filteredDesigns.map(design => {
    const category = categories.find(c => c.id == design.category_id);
    return {
      ...design,
      category_name: category ? category.name : 'Unknown'
    };
  });

  res.json(designsWithCategories);
});

app.post('/api/designs', upload.single('image'), (req, res) => {
  const { title, description, category_id, username } = req.body;

  if (!title || !category_id || !req.file) {
    return res.status(400).json({ error: 'Title, category, and image are required' });
  }

  // Convert image to base64 for simple storage
  const imageBase64 = req.file.buffer.toString('base64');
  const imageUrl = `data:${req.file.mimetype};base64,${imageBase64}`;

  const newDesign = {
    id: nextId++,
    title,
    description: description || '',
    image_url: imageUrl,
    category_id: parseInt(category_id),
    username: username || 'Anonymous',
    status: 'approved',
    votes_count: 0,
    created_at: new Date().toISOString()
  };

  designs.push(newDesign);

  res.json({
    ...newDesign,
    category_name: categories.find(c => c.id == category_id)?.name || 'Unknown'
  });
});

// Voting routes
app.post('/api/designs/:id/vote', (req, res) => {
  const designId = parseInt(req.params.id);
  const design = designs.find(d => d.id === designId);

  if (!design) {
    return res.status(404).json({ error: 'Design not found' });
  }

  design.votes_count++;
  res.json({ message: 'Vote recorded successfully' });
});

// Get top designs
app.get('/api/designs/top', (req, res) => {
  const { limit = 10 } = req.query;
  
  const topDesigns = designs
    .filter(d => d.status === 'approved')
    .sort((a, b) => b.votes_count - a.votes_count)
    .slice(0, parseInt(limit))
    .map(design => {
      const category = categories.find(c => c.id == design.category_id);
      return {
        ...design,
        category_name: category ? category.name : 'Unknown'
      };
    });

  res.json(topDesigns);
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
