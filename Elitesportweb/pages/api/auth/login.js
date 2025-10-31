import dbConnect from '../../../lib/mongodb';
import Member from '../../../models/Member';

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and phone required' });
    }
    
    const member = await Member.findOne({ 
      email: email.toLowerCase().trim(),
      phone: password.trim()
    });

    if (!member) {
      return res.status(200).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({ 
      success: true, 
      member: {
        _id: member._id,
        memberId: member.memberId,
        fullName: member.fullName,
        email: member.email,
        phone: member.phone
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}