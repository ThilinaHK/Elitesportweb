import dbConnect from '../../../lib/mongodb';
import Notification from '../../../models/Notification';
import Member from '../../../models/Member';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const member = await Member.findById(id) || await Member.findOne({ memberId: id });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const notifications = await Notification.find({ 
      $or: [
        { targetType: 'all' },
        { targetType: 'member', targetId: member._id }
      ]
    }).sort({ createdAt: -1 });

    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}