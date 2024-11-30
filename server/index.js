const express = require('express');
const cors = require('cors');
const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const multer = require('multer');
const upload = multer();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET

// Generate a JWT
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, lineofbusiness: user.lineofbusiness }, // Payload
    JWT_SECRET, // Secret key
    { expiresIn: '1h' } // Expiry time
  );
}

// Middleware to authenticate and set `req.user`
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = user; // Attach the user object to the request
    next();
  });
}
// Configure AWS SDK v3
const s3Client = new S3Client({
  region: process.env.AWS_REGION, // E.g., 'us-east-1'
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Set in environment variables
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Set in environment variables
  },
});

const uploadToS3 = async (file, userId) => {
  const params = {
    Bucket: 'pdi-idea-submission', // Replace with your S3 bucket name
    Key: `attachments/${userId}/${Date.now()}_${file.originalname}`, // Add user ID to the path
    Body: file.buffer, // File content
    ContentType: file.mimetype, // File MIME type
  };

  const command = new PutObjectCommand(params);
  const data = await s3Client.send(command);
  return `https://${params.Bucket}.s3.us-east-1.amazonaws.com/${params.Key}`;
};

// Auth routes
app.post('/api/auth/login', asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } }); // Fetch user by email

  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  const token = generateToken(user); // Generate JWT
  res.json({ token, user });
}));

app.post('/api/auth/register', asyncHandler(async (req, res) => {
  const { email, name, role, department, lineofbusiness } = req.body;

  const user = await prisma.user.create({
    data: {
      email,
      name,
      role: "APPLICANT",
      department,
      lineofbusiness,
      createdat: new Date(),
      updatedat: new Date(),
    },
  });

  res.status(201).json(user);
}));

// Ideas endpoints
app.get('/api/ideas', authenticateToken, asyncHandler(async (req, res) => {
  const ideas = await prisma.idea.findMany({
    where: { submittedby: req.user.id },
  }); // Fetch all ideas
  res.json(ideas);
}));

app.get(
  '/api/ideas/line-of-business',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const userLineOfBusiness = req.user.lineofbusiness; // Retrieve the logged-in user's line of business

    // Fetch ideas filtered by the line of business
    const ideas = await prisma.idea.findMany({
      where: { lineofbusiness: userLineOfBusiness },
      include: {
        User: true, // Include details of the user who submitted the idea
        Attachment: true, // Include any attachments
        CoApplicant: true, // Include co-applicant details
        Review: true, // Include related reviews
      },
    });

    res.json(ideas);
  })
);

app.get('/api/ideas/:id', authenticateToken, asyncHandler(async (req, res) => {
  try {
    const idea = await prisma.idea.findUnique({
      where: { id: req.params.id },
      include: {
        CoApplicant: true, // Include co-applicants
        Attachment: true,  // Include attachments
        Review: true,      // Include reviews
        User: {            // Include details of the user who submitted the idea
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            lineofbusiness: true,
          },
        },
      },
    });

    if (!idea) {
      res.status(404).json({ message: 'Idea not found' });
      return;
    }

    res.json(idea);
  } catch (error) {
    console.error('Error fetching idea:', error);
    res.status(500).json({ message: 'Failed to fetch idea' });
  }
}));

app.post('/api/ideas', authenticateToken, upload.array('attachments'), asyncHandler(async (req, res) => {
  const { title, description, expectedImpact, lineOfBusiness, coApplicants } = req.body;

  try {
    const idea = await prisma.idea.create({
      data: {
        title: title,
        description: description,
        expectedimpact: expectedImpact,
        status: 'SUBMITTED',
        lineofbusiness: lineOfBusiness,
        submittedby: req.user.id,
      },
    });

    // Store co-applicants in the CoApplicant table
    if (coApplicants) {
      const coApplicantsArray = JSON.parse(coApplicants); // Parse JSON string if necessary
      console.log('Co-applicants:', coApplicantsArray);
      if (Array.isArray(coApplicantsArray)) {
        await prisma.coApplicant.createMany({
          data: coApplicantsArray.map((coApplicant) => ({
            ideaid: idea.id,
            coapplicantname: coApplicant.email, // Assuming coApplicant contains a 'name' field
          })),
        });
      }
    }

    // Handle attachments and upload to S3
    const files = req.files;
    if (files && files.length > 0) {
      const attachmentUrls = await Promise.all(
        files.map(async (file) => {
          const fileUrl = await uploadToS3(file, req.user.id); // Upload file to S3
          return {
            filename: file.originalname,
            fileurl: fileUrl,
            ideaid: idea.id, // Associate with the created idea
          };
        })
      );

      // Save attachments to the database
      await prisma.attachment.createMany({
        data: attachmentUrls,
      });
    }

    res.status(201).json(idea);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create idea', error: error.message });
  }
}));

// Reviews endpoints
app.post('/api/ideas/:id/reviews', authenticateToken, asyncHandler(async (req, res) => {
  const { stage, status, comments } = req.body;
  reviewerid = req.user.id;

  const idea = await prisma.idea.findUnique({ where: { id: req.params.id } });

  if (!idea) {
    res.status(404).json({ message: 'Idea not found' });
    return;
  }

  const review = await prisma.review.create({
    data: {
      ideaid: req.params.id,
      reviewerid,
      stage,
      status,
      comments,
      createdat: new Date(),
    },
  });

  // Update idea status
  await prisma.idea.update({
    where: { id: req.params.id },
    data: { status },
  });

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


// User API Endpoints

// Retrieve all users
app.get('/api/users', authenticateToken, asyncHandler(async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        lineofbusiness: true,
        createdat: true,
        updatedat: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
}));

// Retrieve a specific user by ID
app.get('/api/users/:id', authenticateToken, asyncHandler(async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        lineofbusiness: true,
        createdat: true,
        updatedat: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
}));

// Update a user by ID
app.put('/api/users/:id/role', authenticateToken, asyncHandler(async (req, res) => {
  const { role } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { 
        role,
        updatedat: new Date(),
      },
    });

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
}));

// Delete a user by ID
app.delete('/api/users/:id', authenticateToken, asyncHandler(async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
}));
