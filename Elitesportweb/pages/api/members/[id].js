import dbConnect from '../../../lib/mongodb';
import Member from '../../../models/Member';

export default async function handler(req, res) {
  const { id } = req.query;

  await dbConnect();

  if (req.method === 'GET') {
    try {
      const member = await Member.findById(id);
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member not found' });
      }
      res.status(200).json({ success: true, member });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { name, email, phone, address, emergencyContact, medicalConditions } = req.body;
      
      const member = await Member.findByIdAndUpdate(
        id,
        { name, email, phone, address, emergencyContact, medicalConditions },
        { new: true }
      );
      
      if (!member) {
        return res.status(404).json({ success: false, message: 'Member not found' });
      }
      
      res.status(200).json({ success: true, member });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}