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
    const { email, phone } = req.body;
    
    if (!email || !phone) {
      return res.status(400).json({ success: false, message: 'Email and phone are required' });
    }
    
    const member = await Member.findOne({
      $and: [
        { email: email },
        { phone: phone }
      ]
    });

    if (!member) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({ success: true, member });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}