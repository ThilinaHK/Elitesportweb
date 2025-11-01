import dbConnect from '../../../lib/mongodb';
import Member from '../../../models/Member';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(500).json({ success: false, message: 'Database connection failed' });
  }

  try {
    const { username, email, phone } = req.body;
    
    if (!username && !email && !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide username, email, or phone to check' 
      });
    }

    const checks = {};
    
    if (username) {
      const usernameExists = await Member.findOne({ username });
      checks.username = !!usernameExists;
    }
    
    if (email) {
      const emailExists = await Member.findOne({ email });
      checks.email = !!emailExists;
    }
    
    if (phone) {
      const phoneExists = await Member.findOne({ phone });
      checks.phone = !!phoneExists;
    }

    res.status(200).json({ 
      success: true, 
      exists: checks,
      available: {
        username: username ? !checks.username : null,
        email: email ? !checks.email : null,
        phone: phone ? !checks.phone : null
      }
    });
  } catch (error) {
    console.error('Check user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}