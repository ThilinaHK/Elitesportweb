import dbConnect from '../../../lib/mongodb'
import Instructor from '../../../models/Instructor'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await dbConnect()
      const instructors = await Instructor.find({}).sort({ name: 1 })
      res.json(instructors || [])
    } catch (error) {
      console.error('Instructors API error:', error)
      // Return mock data when DB is unavailable
      const mockInstructors = [
        { _id: '1', name: 'John Doe', specialization: ['crossfit'], experience: 5, email: 'john@elite.com', phone: '+94771234567' },
        { _id: '2', name: 'Jane Smith', specialization: ['karate'], experience: 8, email: 'jane@elite.com', phone: '+94771234568' },
        { _id: '3', name: 'Mike Johnson', specialization: ['zumba'], experience: 3, email: 'mike@elite.com', phone: '+94771234569' }
      ]
      res.json(mockInstructors)
    }
  } else if (req.method === 'POST') {
    try {
      await dbConnect()
      const instructor = await Instructor.create(req.body)
      res.status(201).json(instructor)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}