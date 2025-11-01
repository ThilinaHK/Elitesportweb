import dbConnect from '../../../lib/mongodb';
import Member from '../../../models/Member';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    const { identifier, type } = req.body; // identifier can be email, phone, or username

    if (!identifier || !type) {
      return res.status(400).json({ 
        success: false, 
        message: 'Identifier and type are required' 
      });
    }

    let query = {};
    switch (type) {
      case 'email':
        query = { email: identifier.toLowerCase().trim() };
        break;
      case 'phone':
        query = { phone: identifier.trim() };
        break;
      case 'username':
        query = { username: identifier.toLowerCase().trim() };
        break;
      default:
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid type. Use email, phone, or username' 
        });
    }

    const member = await Member.findOne(query);
    
    res.status(200).json({ 
      success: true, 
      exists: !!member,
      member: member ? {
        _id: member._id,
        memberId: member.memberId,
        username: member.username,
        fullName: member.fullName,
        email: member.email,
        phone: member.phone
      } : null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}