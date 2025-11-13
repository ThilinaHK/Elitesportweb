import dbConnect from '../../../lib/mongodb';
import Class from '../../../models/Class';
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

    const classes = await Class.find({ members: member._id });
    res.json({ classes });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}