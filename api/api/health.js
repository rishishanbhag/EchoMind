module.exports = function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: "OK", 
      message: "Backend is running",
      timestamp: new Date().toISOString()
    });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};
