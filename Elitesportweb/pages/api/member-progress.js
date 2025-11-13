import dbConnect from '../../lib/mongodb';
import Progress from '../../models/Progress';
import Member from '../../models/Member';

export default async function handler(req, res) {
  const memberId = req.cookies.memberId;
  
  if (!memberId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    await dbConnect();
    
    const member = await Member.findOne({ memberId });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    if (req.method === 'GET') {
      const progress = await Progress.find({ memberId: member._id }).sort({ date: -1 });
      res.json(progress);
    }
    else if (req.method === 'POST') {
      const progressData = {
        ...req.body,
        memberId: member._id,
        memberName: member.fullName
      };
      const progress = await Progress.create(progressData);
      res.status(201).json(progress);
    }
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Member progress error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}