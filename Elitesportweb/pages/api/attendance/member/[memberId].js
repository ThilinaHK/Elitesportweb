import dbConnect from '../../../../lib/mongodb';
import Attendance from '../../../../models/Attendance';
import Class from '../../../../models/Class';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { memberId } = req.query;
    const { month, year } = req.query;

    if (!memberId) {
      return res.status(400).json({ error: 'Member ID is required' });
    }

    // Build date filter
    let dateFilter = {};
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      dateFilter = {
        date: {
          $gte: startDate,
          $lte: endDate
        }
      };
    }

    // Get attendance records for the member
    const attendanceRecords = await Attendance.find({
      memberId,
      ...dateFilter
    })
    .populate('classId', 'name category day time')
    .sort({ date: -1 });

    // Calculate attendance statistics
    const totalClasses = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(record => record.status === 'present').length;
    const absentCount = attendanceRecords.filter(record => record.status === 'absent').length;
    const lateCount = attendanceRecords.filter(record => record.status === 'late').length;
    
    const attendancePercentage = totalClasses > 0 ? ((presentCount + lateCount) / totalClasses * 100).toFixed(1) : 0;

    res.status(200).json({
      attendance: attendanceRecords,
      statistics: {
        totalClasses,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        attendancePercentage: parseFloat(attendancePercentage)
      }
    });
  } catch (error) {
    console.error('Error fetching member attendance:', error);
    res.status(500).json({ error: 'Failed to fetch attendance data' });
  }
}