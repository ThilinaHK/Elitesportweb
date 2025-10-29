export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const envVars = {
    MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
    NODE_ENV: process.env.NODE_ENV || 'Not set',
    VERCEL: process.env.VERCEL ? 'Yes' : 'No',
    VERCEL_ENV: process.env.VERCEL_ENV || 'Not set'
  };

  res.status(200).json({
    success: true,
    environment: envVars,
    timestamp: new Date().toISOString()
  });
}