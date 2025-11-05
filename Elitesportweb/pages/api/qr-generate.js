import dbConnect from '../../lib/mongodb';
import Class from '../../models/Class';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { classId, date } = req.query;

    if (!classId) {
      return res.status(400).json({ error: 'Class ID required' });
    }

    const classDetails = await Class.findById(classId);
    if (!classDetails) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const qrData = classId; // Static QR code with just class ID

    res.status(200).json({
      qrData,
      className: classDetails.name,
      day: classDetails.day,
      time: classDetails.time,
      isStatic: true,
      message: 'This QR code can be used for all classes of this type'
    });

  } catch (error) {
    console.error('Error generating QR data:', error);
    res.status(500).json({ error: 'Failed to generate QR data' });
  }
}
