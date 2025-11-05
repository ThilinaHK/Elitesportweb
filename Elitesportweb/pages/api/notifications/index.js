import dbConnect from '../../../lib/mongodb';
import Notification from '../../../models/Notification';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const notifications = await Notification.find().sort({ createdAt: -1 });
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const notification = new Notification(req.body);
      await notification.save();
      res.status(201).json({ success: true, notification });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
