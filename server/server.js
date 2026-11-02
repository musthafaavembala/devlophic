const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const {
  getContent,
  saveContent,
  getSubmissions,
  addSubmission,
  updateSubmissionStatus,
  verifyAdminCredentials,
  changeAdminPassword
} = require('./storage');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || (
  process.env.NODE_ENV === 'production' ? undefined : crypto.randomBytes(32).toString('hex')
);
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be configured in production.');
}

// Uploads directory
const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer Storage Configuration
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${base}_${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage: storageConfig,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg|gif/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      return cb(null, true);
    }
    cb(new Error('Only image files (JPEG, PNG, WebP, SVG) are allowed'));
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving
app.use('/public', express.static(path.join(__dirname, '..', 'public')));
app.use('/uploads', express.static(UPLOADS_DIR));

// Serve devlophiclogo.jpeg directly
app.get('/devlophiclogo.jpeg', (req, res) => {
  const logoPath = path.join(__dirname, '..', 'public', 'devlophiclogo.jpeg');
  if (fs.existsSync(logoPath)) {
    return res.sendFile(logoPath);
  }
  const rootLogoPath = path.join(__dirname, '..', 'devlophiclogo.jpeg');
  if (fs.existsSync(rootLogoPath)) {
    return res.sendFile(rootLogoPath);
  }
  res.status(404).send('Logo not found');
});

// Rate limiting for login
const loginAttempts = new Map();
function rateLimitLogin(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0, resetAt: now + 15 * 60 * 1000 };

  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + 15 * 60 * 1000;
  }

  if (record.count >= 10) {
    const waitMins = Math.ceil((record.resetAt - now) / 60000);
    return res.status(429).json({
      error: `Too many login attempts. Please wait ${waitMins} minute(s) before trying again.`
    });
  }

  record.count++;
  loginAttempts.set(ip, record);
  next();
}

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied: Authentication token required.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Session expired or invalid token. Please log in again.' });
    }
    req.user = user;
    next();
  });
}

// PUBLIC ROUTES

// 1. Get Website Content
app.get('/api/content', (req, res) => {
  try {
    const content = getContent();
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve website content' });
  }
});

// 2. Submit Contact Inquiry / Quote Request
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, phone, serviceCategory, timeline, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please provide your name, email, and project details.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const submission = {
      id: `inq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      serviceCategory: serviceCategory || 'Website Development',
      timeline: timeline || 'Standard (2-4 weeks)',
      message: message.trim(),
      createdAt: new Date().toISOString(),
      status: 'unread'
    };

    addSubmission(submission);

    res.status(201).json({
      success: true,
      message: 'Inquiry received successfully. The Devlophic team will get back to you shortly.',
      submissionId: submission.id
    });
  } catch (err) {
    console.error('Contact submission error:', err);
    res.status(500).json({ error: 'An error occurred while processing your message.' });
  }
});

// 3. Admin Login
app.post('/api/auth/login', rateLimitLogin, (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const isValid = verifyAdminCredentials(username, password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid admin username or password.' });
    }

    // Reset rate limit on success
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    loginAttempts.delete(ip);

    const token = jwt.sign(
      { username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        username,
        role: 'admin',
        brand: 'Devlophic'
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Authentication service encountered an error.' });
  }
});

// PROTECTED ADMIN ROUTES

// 4. Verify Admin Session
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({
    authenticated: true,
    user: req.user
  });
});

// 5. Change Admin Password
app.post('/api/auth/change-password', authenticateToken, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = changeAdminPassword(req.user.username, currentPassword, newPassword);

    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    res.json({ success: true, message: result.message });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update admin password.' });
  }
});

// 6. Update Full Website Content
app.put('/api/content', authenticateToken, (req, res) => {
  try {
    const newContent = req.body;
    if (!newContent || typeof newContent !== 'object') {
      return res.status(400).json({ error: 'Invalid content payload.' });
    }

    // Enforce business brand rules
    newContent.brandName = "Devlophic";
    // Never allow location to be injected
    if (newContent.contact) {
      delete newContent.contact.location;
      delete newContent.contact.address;
      delete newContent.contact.city;
      delete newContent.contact.country;
    }

    saveContent(newContent);
    res.json({ success: true, message: 'Content updated successfully', content: newContent });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save updated content.' });
  }
});

// 7. Get All Inquiries
app.get('/api/submissions', authenticateToken, (req, res) => {
  try {
    const submissions = getSubmissions();
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// 8. Update Inquiry Status
app.patch('/api/submissions/:id', authenticateToken, (req, res) => {
  try {
    const { status } = req.body;
    const updated = updateSubmissionStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    res.json({ success: true, submission: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update submission status' });
  }
});

// 9. Add or Update Projects directly
app.post('/api/projects', authenticateToken, (req, res) => {
  try {
    const content = getContent();
    const newProject = {
      id: `proj-${Date.now()}`,
      title: req.body.title || 'Untitled Website Project',
      category: req.body.category || 'Business Website',
      shortDescription: req.body.shortDescription || '',
      fullDescription: req.body.fullDescription || '',
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
      liveUrl: req.body.liveUrl || '',
      githubUrl: req.body.githubUrl || '',
      externalUrl: req.body.externalUrl || '',
      imageUrl: req.body.imageUrl || '/devlophiclogo.jpeg',
      featured: Boolean(req.body.featured),
      order: content.projects.length + 1
    };

    content.projects.unshift(newProject);
    saveContent(content);

    res.status(201).json({ success: true, project: newProject });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.put('/api/projects/:id', authenticateToken, (req, res) => {
  try {
    const content = getContent();
    const index = content.projects.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    content.projects[index] = {
      ...content.projects[index],
      ...req.body,
      id: req.params.id
    };

    saveContent(content);
    res.json({ success: true, project: content.projects[index] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', authenticateToken, (req, res) => {
  try {
    const content = getContent();
    content.projects = content.projects.filter(p => p.id !== req.params.id);
    saveContent(content);
    res.json({ success: true, message: 'Project removed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// 10. File Upload (Image)
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }
    const publicUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: publicUrl,
      filename: req.file.filename
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Production: serve built static frontend if present
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Fallback to index.html for client-side routing
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads') && !req.path.startsWith('/public')) {
    if (fs.existsSync(distPath)) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Devlophic API Server running on port ${PORT}`);
});
