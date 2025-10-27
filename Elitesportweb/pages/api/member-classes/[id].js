import dbConnect from '../../../lib/mongodb';
import Member from '../../../models/Member';
import Class from '../../../models/Class';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const member = await Member.findById(id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    const classes = await Class.find({ _id: { $in: member.assignedClasses } });
    res.status(200).json({ success: true, classes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}