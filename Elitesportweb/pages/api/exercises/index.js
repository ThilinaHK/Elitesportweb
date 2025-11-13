import dbConnect from '../../../lib/mongodb'
import Exercise from '../../../models/Exercise'

export default async function handler(req, res) {
  await dbConnect()

  if (req.method === 'GET') {
    try {
      const exercises = await Exercise.find({}).populate('memberId', 'name email').sort({ createdAt: -1 })
      res.json(exercises)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch exercises' })
    }
  } else if (req.method === 'POST') {
    try {
      const { id, planName, memberId, assignedBy, ...otherData } = req.body
      
      // Validate required fields
      if (!planName || !memberId || !assignedBy) {
        return res.status(400).json({ 
          error: 'Missing required fields: planName, memberId, and assignedBy are required',
          received: { planName: !!planName, memberId: !!memberId, assignedBy: !!assignedBy }
        })
      }
      
      const exerciseData = { planName, memberId, assignedBy, ...otherData }
      
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
      console.error('Exercise operation error:', error)
      res.status(500).json({ 
        error: 'Failed to process exercise',
        details: error.message 
      })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, planName, memberId, assignedBy, ...otherData } = req.body
      
      if (!id) {
        return res.status(400).json({ error: 'Exercise ID is required for update' })
      }
      
      if (!planName || !memberId || !assignedBy) {
        return res.status(400).json({ 
          error: 'Missing required fields: planName, memberId, and assignedBy are required' 
        })
      }
      
      const exerciseData = { planName, memberId, assignedBy, ...otherData }
      const updatedExercise = await Exercise.findByIdAndUpdate(id, exerciseData, { new: true })
      
      if (!updatedExercise) {
        return res.status(404).json({ error: 'Exercise not found' })
      }
      
      res.json(updatedExercise)
    } catch (error) {
      console.error('Exercise update error:', error)
      res.status(500).json({ 
        error: 'Failed to update exercise',
        details: error.message 
      })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body
      
      if (!id) {
        return res.status(400).json({ error: 'Exercise ID is required for deletion' })
      }
      
      const deletedExercise = await Exercise.findByIdAndDelete(id)
      
      if (!deletedExercise) {
        return res.status(404).json({ error: 'Exercise not found' })
      }
      
      res.json({ message: 'Exercise deleted successfully', id })
    } catch (error) {
      console.error('Exercise deletion error:', error)
      res.status(500).json({ 
        error: 'Failed to delete exercise',
        details: error.message 
      })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
