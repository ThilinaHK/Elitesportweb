import dbConnect from '../../../lib/mongodb'
import Exercise from '../../../models/Exercise'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect()
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(200).json({ success: true, exercises: [] });
  }

  try {
    const exercises = await Exercise.find({ memberId: id, isActive: true })
    res.status(200).json({ success: true, exercises: exercises || [] })
  } catch (error) {
    console.error('Member exercises fetch error:', error);
    res.status(200).json({ success: true, exercises: [] })
  }
}