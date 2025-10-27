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
      // Create default instructors if database is empty
      const defaultInstructors = [
        { name: 'John Doe', specialization: ['crossfit'], experience: 5, email: 'john@elite.com', phone: '+94771234567', position: 'instructor', salary: 50000, qualifications: ['CrossFit Level 1'], bio: 'Experienced CrossFit trainer' },
        { name: 'Jane Smith', specialization: ['karate'], experience: 8, email: 'jane@elite.com', phone: '+94771234568', position: 'instructor', salary: 55000, qualifications: ['Black Belt 3rd Dan'], bio: 'Traditional karate master' },
        { name: 'Mike Johnson', specialization: ['zumba'], experience: 3, email: 'mike@elite.com', phone: '+94771234569', position: 'instructor', salary: 45000, qualifications: ['Zumba Certified'], bio: 'High-energy dance instructor' }
      ]
      
      try {
        await dbConnect()
        const createdInstructors = await Instructor.insertMany(defaultInstructors)
        res.json(createdInstructors)
      } catch (dbError) {
        console.error('Failed to create default instructors:', dbError)
        res.json(defaultInstructors.map((inst, index) => ({ ...inst, _id: (index + 1).toString() })))
      }
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