import dbConnect from '../../../lib/mongodb'
import Exercise from '../../../models/Exercise'

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  const { id } = req.query
  await dbConnect()

  if (req.method === 'PUT') {
    try {
      let exercise = await Exercise.findByIdAndUpdate(id, req.body, { new: true }).catch(() => null)
      if (!exercise) {
        exercise = await Exercise.findOneAndUpdate({ memberId: id }, req.body, { new: true })
      }
      if (!exercise) {
        return res.status(404).json({ error: 'Exercise plan not found' })
      }
      res.json(exercise)
    } catch (error) {
      res.status(500).json({ error: 'Failed to update exercise plan' })
    }
  } else if (req.method === 'DELETE') {
    try {
      await Exercise.findByIdAndDelete(id)
      res.json({ message: 'Exercise plan deleted successfully' })
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete exercise plan' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}