import dbConnect from '../../lib/mongodb';
import Member from '../../models/Member';
import cors from '../../lib/cors';

export default async function handler(req, res) {
  cors(req, res);

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    // Find the member with email thilina2u@gmail.com
    const member = await Member.findOne({ email: 'thilina2u@gmail.com' });
    
    if (!member) {
      return res.status(404).json({ 
        success: false, 
        message: 'Member not found',
        suggestion: 'Please check if member exists in database'
      });
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
    console.error('Test member error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}