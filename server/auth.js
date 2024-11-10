const express = require('express');
const { PrismaClient } = require('@prisma/client');
const asyncHandler = require('express-async-handler');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/login', asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  res.json(user);
}));

module.exports = router;