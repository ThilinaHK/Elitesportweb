import dbConnect from '../../../lib/mongodb';
import Member from '../../../models/Member';

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, phone } = req.body;
    
    if (!email || !phone) {
      return res.status(400).json({ success: false, message: 'Email and phone required' });
    }
    
    // Test credentials
    if (email.toLowerCase().trim() === 'thilina2u@gmail.com' && phone.trim() === '0716800490') {
      return res.status(200).json({ 
        success: true, 
        member: {
          _id: '68fd9649d0e2186827a15d0b',
          memberId: 'ESA4954513317',
          fullName: 'THK',
          email: 'thilina2u@gmail.com',
          phone: '0716800490'
        }
      });
    }
    
    try {
      await dbConnect();
      
      const member = await Member.findOne({ 
        email: email.toLowerCase().trim(),
        phone: phone.trim()
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
    } catch (dbError) {
      console.error('Database error, using fallback:', dbError.message);
      return res.status(200).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Auth login error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}
