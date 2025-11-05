import dbConnect from '../../../lib/mongodb';
import Attendance from '../../../models/Attendance';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { classId, month, year } = req.query;

    if (!classId) {
      return res.status(400).json({ error: 'Class ID is required' });
    }

    // Build date filter
    let dateFilter = { classId };
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      dateFilter.date = {
        $gte: startDate,
        $lte: endDate
      };
    }

    // Get attendance records
    const attendanceRecords = await Attendance.find(dateFilter)
      .populate('memberId', 'fullName email')
      .populate('classId', 'name')
      .sort({ date: -1 });

    res.status(200).json({
      attendance: attendanceRecords
    });
  } catch (error) {
    console.error('Error fetching attendance history:', error);
    res.status(500).json({ error: 'Failed to fetch attendance history' });
  }
}
