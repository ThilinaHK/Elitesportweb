import dbConnect from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    res.status(200).json({ 
      success: true, 
      message: 'API is working',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(200).json({ 
      success: false, 
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString(),
      database: 'disconnected'
    });
  }
}
