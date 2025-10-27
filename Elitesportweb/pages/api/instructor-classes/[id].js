import dbConnect from '../../../lib/mongodb';
import Class from '../../../models/Class';
import Instructor from '../../../models/Instructor';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const instructor = await Instructor.findById(id);
    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Instructor not found' });
    }

    const classes = await Class.find({ instructor: instructor.name });
    res.status(200).json({ success: true, classes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}