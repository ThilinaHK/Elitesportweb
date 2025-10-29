import dbConnect from '../../../lib/mongodb'
import Exercise from '../../../models/Exercise'

export default async function handler(req, res) {
  const { id } = req.query
  await dbConnect()

  if (req.method === 'PUT') {
    try {
      const exercise = await Exercise.findByIdAndUpdate(id, req.body, { new: true })
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