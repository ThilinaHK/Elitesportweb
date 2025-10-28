import connectDB from '../../../../lib/mongodb';
import Instructor from '../../../../models/Instructor';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    const { id } = req.query;
    const { privileges } = req.body;

    const instructor = await Instructor.findByIdAndUpdate(
      id,
      { privileges },
      { new: true }
    );

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    res.status(200).json({ message: 'Privileges updated successfully', instructor });
  } catch (error) {
    console.error('Error updating privileges:', error);
    res.status(500).json({ message: 'Server error' });
  }
}