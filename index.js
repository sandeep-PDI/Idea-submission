const express = require('express');
const cors = require('cors');
const asyncHandler = require('express-async-handler');

const app = express();
const port = 3000;

// In-memory store
const db = {
  users: [
    { id: '1', email: 'admin@example.com', name: 'Admin User', role: 'ADMIN', department: 'Technology', lineOfBusiness: 'SOFTWARE' },
    { id: '2', email: 'reviewer@example.com', name: 'Reviewer User', role: 'REVIEWER', department: 'R&D', lineOfBusiness: 'RESEARCH' },
    { id: '3', email: 'user@example.com', name: 'Regular User', role: 'APPLICANT', department: 'Engineering', lineOfBusiness: 'HARDWARE' }
  ],
  ideas: [],
  reviews: [],
  attachments: []
};

app.use(cors());
app.use(express.json());

// Auth routes
app.post('/api/auth/login', asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = db.users.find(u => u.email === email);

  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  res.json(user);
}));

// Ideas endpoints
app.get('/api/ideas', asyncHandler(async (req, res) => {
  res.json(db.ideas);
}));

app.get('/api/ideas/:id', asyncHandler(async (req, res) => {
  const idea = db.ideas.find(i => i.id === req.params.id);
  
  if (!idea) {
    res.status(404).json({ message: 'Idea not found' });
    return;
  }
  
  res.json(idea);
}));

app.post('/api/ideas', asyncHandler(async (req, res) => {
  const {
    title,
    description,
    expectedImpact,
    submittedBy,
    coApplicants,
    lineOfBusiness
  } = req.body;

  const idea = {
    id: Date.now().toString(),
    title,
    description,
    expectedImpact,
    status: 'SUBMITTED',
    submittedBy,
    coApplicants: coApplicants || [],
    lineOfBusiness,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    attachments: [],
    reviews: []
  };

  db.ideas.push(idea);
  res.status(201).json(idea);
}));

// Reviews endpoints
app.post('/api/ideas/:id/reviews', asyncHandler(async (req, res) => {
  const { reviewerId, stage, status, comments } = req.body;
  const idea = db.ideas.find(i => i.id === req.params.id);
  
  if (!idea) {
    res.status(404).json({ message: 'Idea not found' });
    return;
  }

  const review = {
    id: Date.now().toString(),
    ideaId: req.params.id,
    reviewerId,
    stage,
    status,
    comments,
    createdAt: new Date().toISOString()
  };

  idea.reviews.push(review);
  idea.status = status;
  
  res.status(201).json(review);
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});