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
      const { id, ...exerciseData } = req.body
      
      // Validate required fields
      if (!exerciseData.planName || !exerciseData.memberId || !exerciseData.assignedBy) {
        return res.status(400).json({ 
          error: 'Missing required fields: planName, memberId, and assignedBy are required' 
        })
      }
      
      // If ID provided, update existing exercise
      if (id) {
        const updatedExercise = await Exercise.findByIdAndUpdate(id, exerciseData, { new: true })
        if (!updatedExercise) {
          return res.status(404).json({ error: 'Exercise not found' })
        }
        return res.json(updatedExercise)
      }
      
      // Create new exercise
      const exercise = await Exercise.create(exerciseData)
      res.status(201).json(exercise)
    } catch (error) {
      console.error('Exercise creation error:', error)
      res.status(500).json({ 
        error: 'Failed to create exercise plan',
        details: error.message 
      })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
