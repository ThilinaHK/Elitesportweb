import dbConnect from '../../../../lib/mongodb';
import Attendance from '../../../../models/Attendance';
import Member from '../../../../models/Member';
import Class from '../../../../models/Class';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { classId } = req.query;
    const { date } = req.query;

    if (!classId) {
      return res.status(400).json({ error: 'Class ID is required' });
    }

    // Get class details
    const classDetails = await Class.findById(classId);
    if (!classDetails) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Get all members enrolled in this class
    const members = await Member.find({ 
      assignedClasses: { $in: [classId] } 
    }).select('fullName email phone');

    // Get attendance for specific date if provided
    let attendanceRecords = [];
    if (date) {
      attendanceRecords = await Attendance.find({
        classId,
        date: new Date(date)
      }).populate('memberId', 'fullName email');
    }

    // Create attendance data with member info
    const attendanceData = members.map(member => {
      const attendanceRecord = attendanceRecords.find(
        record => record.memberId._id.toString() === member._id.toString()
      );
      
      return {
        memberId: member._id,
        memberName: member.fullName,
        email: member.email,
        phone: member.phone,
        status: attendanceRecord?.status || 'not_marked',
        notes: attendanceRecord?.notes || '',
        markedAt: attendanceRecord?.markedAt || null
      };
    });

    res.status(200).json({
      class: classDetails,
      members: attendanceData,
      date: date || new Date().toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('Error fetching class attendance:', error);
    res.status(500).json({ error: 'Failed to fetch attendance data' });
  }
}