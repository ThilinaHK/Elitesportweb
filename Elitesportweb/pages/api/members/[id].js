import dbConnect from '../../../lib/mongodb';
import Member from '../../../models/Member';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    await dbConnect();
    
    if (req.method === 'GET') {
      const member = await Member.findById(id) || await Member.findOne({ memberId: id });
      if (!member) {
        return res.status(404).json({ error: 'Member not found' });
      }
      res.json({ member });
    }
    else if (req.method === 'PUT') {
      const { assignedClasses, ...updateData } = req.body;
      const member = await Member.findByIdAndUpdate(id, updateData, { new: true }) || 
                     await Member.findOneAndUpdate({ memberId: id }, updateData, { new: true });
      if (!member) {
        return res.status(404).json({ error: 'Member not found' });
      }
      res.json({ success: true, member });
    }
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}