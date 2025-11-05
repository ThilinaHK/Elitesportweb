import dbConnect from '../../../lib/mongodb';
import Attendance from '../../../models/Attendance';
import Member from '../../../models/Member';
import Class from '../../../models/Class';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { memberId, classId, date, status, markedBy, markedById, notes } = req.body;

    if (!memberId || !classId || !markedBy) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Use current date if not provided
    const attendanceDate = date ? new Date(date) : new Date();
    const attendanceStatus = status || 'Present';

    // Check if member is enrolled in this class
    const member = await Member.findById(memberId);
    if (!member || !member.assignedClasses.includes(classId)) {
      return res.status(400).json({ error: 'Member not enrolled in this class' });
    }

    // Get class info
    const classInfo = await Class.findById(classId);
    if (!classInfo) {
      return res.status(400).json({ error: 'Class not found' });
    }

    // Check if attendance already exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await Attendance.findOne({
      memberId,
      classId,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (existingAttendance) {
      return res.status(400).json({ error: 'Attendance already marked for today' });
    }

    // Create new attendance record
    const attendance = new Attendance({
      memberId,
      classId,
      date: attendanceDate,
      status: attendanceStatus,
      markedBy,
      markedById: markedById || memberId,
      notes: notes || ''
    });

    await attendance.save();

    res.status(201).json({ 
      message: 'Attendance marked successfully',
      attendance,
      className: classInfo.name,
      status: attendanceStatus
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
}
