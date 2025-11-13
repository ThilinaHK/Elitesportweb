import dbConnect from '../../lib/mongodb';
import Attendance from '../../models/Attendance';
import Member from '../../models/Member';

export default async function handler(req, res) {
  const memberId = req.cookies.memberId;
  
  if (!memberId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const member = await Member.findOne({ memberId });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const { month, year } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendance = await Attendance.find({
      memberId: member._id,
      date: { $gte: startDate, $lte: endDate }
    }).populate('classId');

    const statistics = {
      totalClasses: attendance.length,
      present: attendance.filter(a => a.status === 'present').length,
      absent: attendance.filter(a => a.status === 'absent').length,
      late: attendance.filter(a => a.status === 'late').length
    };
    
    statistics.attendancePercentage = statistics.totalClasses > 0 
      ? Math.round((statistics.present / statistics.totalClasses) * 100) 
      : 0;

    res.json({ attendance, statistics });
  } catch (error) {
    console.error('Member attendance error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}