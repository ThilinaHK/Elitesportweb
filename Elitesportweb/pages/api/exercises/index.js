import dbConnect from '../../../lib/mongodb'
import Exercise from '../../../models/Exercise'

export default async function handler(req, res) {
  await dbConnect()

  if (req.method === 'GET') {
    try {
      const exercises = await Exercise.find({}).sort({ createdAt: -1 })
      res.json(exercises)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch exercises' })
    }
  } else if (req.method === 'POST') {
    try {
      const exercise = await Exercise.create(req.body)
      res.status(201).json(exercise)
    } catch (error) {
      res.status(500).json({ error: 'Failed to create exercise plan' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}