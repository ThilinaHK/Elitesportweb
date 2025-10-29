import dbConnect from '../../../lib/mongodb'
import Exercise from '../../../models/Exercise'

export default async function handler(req, res) {
  const { id } = req.query

  try {
    await dbConnect()
    
    const exercises = await Exercise.find({ memberId: id, isActive: true })
    
    res.status(200).json({ exercises })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}