import dbConnect from '../../lib/mongodb';
import Member from '../../models/Member';

export default async function handler(req, res) {
  const memberId = req.cookies.memberId;
  
  if (!memberId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    await dbConnect();
    
    if (req.method === 'GET') {
      const member = await Member.findOne({ memberId });
      if (!member) {
        return res.status(404).json({ error: 'Member not found' });
      }
      res.json({ member });
    } 
    else if (req.method === 'PUT') {
      const member = await Member.findOneAndUpdate(
        { memberId }, 
        req.body, 
        { new: true, runValidators: true }
      );
      if (!member) {
        return res.status(404).json({ error: 'Member not found' });
      }
      res.json({ success: true, member });
    }
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Member profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}