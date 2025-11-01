import dbConnect from '../../../lib/mongodb';
import Member from '../../../models/Member';
import Class from '../../../models/Class';
import cors from '../../../lib/cors';

export default async function handler(req, res) {
  cors(req, res);
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(500).json({ success: false, message: 'Database connection failed', classes: [] });
  }

  try {
    const member = await Member.findById(id);
    if (!member) {
      return res.status(200).json({ success: true, classes: [] });
    }

    const classes = await Class.find({ _id: { $in: member.assignedClasses || [] } });
    res.status(200).json({ success: true, classes: classes || [] });
  } catch (error) {
    console.error('Member classes fetch error:', error);
    res.status(200).json({ success: true, classes: [] });
  }
}