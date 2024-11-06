const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(bodyParser.json());

// Example in-memory user data
const users = [];

// Register endpoint
app.post('/api/signup', (req, res) => {
  const { email, password, username, imageUrl } = req.body;

  if (!email || !password || !username || !imageUrl) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = { email, password: hashedPassword, username, imageUrl };
  users.push(newUser);

  const token = jwt.sign({ email }, 'your_jwt_secret', { expiresIn: '1h' });

  res.status(201).json({ token });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials.' });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: 'Invalid credentials.' });
  }

  const token = jwt.sign({ email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
  res.status(200).json({ token });
});

// Profile endpoint (Authenticated users only)
app.get('/api/users/profile', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = users.find(u => u.email === decoded.email);
    if (user) {
      res.status(200).json({ username: user.username, email: user.email, imageUrl: user.imageUrl });
    } else {
      res.status(404).json({ error: 'User not found.' });
    }
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
