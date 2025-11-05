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
    const { qrData, memberId } = req.body;

    if (!qrData || !memberId) {
      return res.status(400).json({ error: 'QR data and member ID required' });
    }

    // Parse QR data: classId (static QR code)
    const classId = qrData.trim();
    const currentDate = new Date();

    // Check if member exists and is enrolled in class
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    if (!member.assignedClasses.includes(classId)) {
      return res.status(403).json({ error: 'Not enrolled in this class' });
    }

    // Get class details
    const classDetails = await Class.findById(classId);
    if (!classDetails) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Check if already marked attendance today
    const existingAttendance = await Attendance.findOne({
      memberId,
      classId,
      date: {
        $gte: new Date(currentDate.setHours(0, 0, 0, 0)),
        $lt: new Date(currentDate.setHours(23, 59, 59, 999))
      }
    });

    if (existingAttendance) {
      return res.status(400).json({ error: 'Attendance already marked for today' });
    }

    // Determine status based on class time and current time
    const now = new Date();
    const today = now.toDateString();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // minutes from midnight
    
    // Parse class time (e.g., "09:30" -> 570 minutes)
    const [hours, minutes] = classDetails.time.split(':').map(Number);
    const classTimeMinutes = hours * 60 + minutes;
    
    let status = 'present';
    const timeDiff = currentTime - classTimeMinutes;
    
    if (timeDiff > 15) { // More than 15 minutes after class start
      status = 'late';
    } else if (timeDiff < -30) { // More than 30 minutes before class
      return res.status(400).json({ error: 'Too early to mark attendance' });
    }

    // Mark attendance
    const attendance = new Attendance({
      memberId,
      classId,
      date: new Date(),
      status,
      markedBy: 'qr_scan',
      notes: `QR scan at ${scanTime.toLocaleTimeString()}`
    });

    await attendance.save();

    res.status(200).json({
      success: true,
      message: `Attendance marked as ${status}`,
      status,
      className: classDetails.name,
      time: scanTime.toLocaleTimeString()
    });

  } catch (error) {
    console.error('Error processing QR attendance:', error);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
}
