import dbConnect from '../../../lib/mongodb';
import Instructor from '../../../models/Instructor';
import Class from '../../../models/Class';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { instructorId, classIds } = req.body;

    if (!instructorId || !Array.isArray(classIds)) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    // Update instructor with assigned classes
    const instructor = await Instructor.findByIdAndUpdate(
      instructorId,
      { assignedClasses: classIds },
      { new: true }
    );

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    // Update classes to set instructor name
    await Class.updateMany(
      { _id: { $in: classIds } },
      { instructor: instructor.name }
    );

    // Remove instructor from classes not in the new assignment
    await Class.updateMany(
      { 
        instructor: instructor.name,
        _id: { $nin: classIds }
      },
      { instructor: '' }
    );

    res.status(200).json({ 
      success: true, 
      message: 'Classes assigned successfully',
      instructor 
    });
  } catch (error) {
    console.error('Assign classes error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}