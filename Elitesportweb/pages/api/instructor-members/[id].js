import dbConnect from '../../../lib/mongodb';
import Member from '../../../models/Member';
import Class from '../../../models/Class';
import Instructor from '../../../models/Instructor';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid instructor ID format' });
  }

  await dbConnect();

  try {
    const instructor = await Instructor.findById(id);
    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Instructor not found' });
    }

    // Find classes by instructor's assigned classes or by instructor name
    let instructorClasses = []
    
    // First, try to get classes from assignedClasses field
    if (instructor.assignedClasses && instructor.assignedClasses.length > 0) {
      instructorClasses = await Class.find({
        _id: { $in: instructor.assignedClasses }
      })
    }
    
    // If no assigned classes found, fall back to name matching
    if (instructorClasses.length === 0) {
      instructorClasses = await Class.find({
        $or: [
          { instructor: instructor.name },
          { instructor: id }
        ]
      })
    }
    const classIds = instructorClasses.map(cls => cls._id.toString());

    // Find members assigned to these classes
    const members = await Member.find({
      assignedClasses: { $in: classIds }
    });

    // Add class names to member data
    const membersWithClasses = members.map(member => {
      const memberObj = member.toObject();
      const memberClassNames = instructorClasses
        .filter(cls => member.assignedClasses.includes(cls._id.toString()))
        .map(cls => cls.name);
      
      return {
        ...memberObj,
        classNames: memberClassNames
      };
    });

    res.status(200).json({ success: true, members: membersWithClasses });
  } catch (error) {
    console.error('Instructor members API error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}