import dbConnect from '../../../lib/mongodb';
import Member from '../../../models/Member';
import Notification from '../../../models/Notification';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(200).json({ success: true, notifications: [] });
  }

  try {
    const member = await Member.findById(id);
    if (!member) {
      return res.status(200).json({ success: true, notifications: [] });
    }

    const notifications = await Notification.find({
      classId: { $in: member.assignedClasses || [] },
      isActive: true
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, notifications: notifications || [] });
  } catch (error) {
    console.error('Member notifications fetch error:', error);
    res.status(200).json({ success: true, notifications: [] });
  }
}