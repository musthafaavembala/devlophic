export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, serviceCategory, timeline, message } = req.body || {};

    if (!name || !email || !message || !String(name).trim() || !String(email).trim() || !String(message).trim()) {
      return res.status(400).json({ error: 'Please provide your name, email, and project details.' });
    }

    const emailStr = String(email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const submissionId = `inq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    return res.status(201).json({
      success: true,
      message: 'Inquiry received successfully. The Devlophic team will get back to you shortly.',
      submissionId
    });
  } catch (err) {
    console.error('Vercel API contact handler error:', err);
    return res.status(500).json({ error: 'An unexpected server error occurred.' });
  }
}
