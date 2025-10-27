import dbConnect from '../../../lib/mongodb';
import Member from '../../../models/Member';
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

    const instructorClasses = await Class.find({ instructor: instructor.name });
    const classIds = instructorClasses.map(cls => cls._id);

    const members = await Member.find({
      assignedClasses: { $in: classIds }
    });

    const membersWithClasses = members.map(member => ({
      ...member.toObject(),
      classNames: instructorClasses
        .filter(cls => member.assignedClasses.includes(cls._id.toString()))
        .map(cls => cls.name)
    }));

    res.status(200).json({ success: true, members: membersWithClasses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}