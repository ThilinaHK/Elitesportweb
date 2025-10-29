import dbConnect from '../../../lib/mongodb'
import Instructor from '../../../models/Instructor'
import { fallbackInstructors } from '../../../lib/fallbackData'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await dbConnect()
      const instructors = await Instructor.find({}).sort({ name: 1 })
      res.json(instructors || [])
    } catch (error) {
      console.error('Instructors API error:', error)
      res.json(fallbackInstructors)
    }
  } else if (req.method === 'POST') {
    try {
      await dbConnect()
      
      // Generate unique instructor ID with EL00 prefix
      const lastInstructor = await Instructor.findOne({}, {}, { sort: { 'createdAt': -1 } })
      let nextNumber = 1
      if (lastInstructor && lastInstructor.instructorId) {
        const lastNumber = parseInt(lastInstructor.instructorId.replace('EL00', ''))
        nextNumber = lastNumber + 1
      }
      const instructorId = `EL00${nextNumber.toString().padStart(3, '0')}`
      
      const instructorData = {
        ...req.body,
        instructorId
      }
      
      const instructor = await Instructor.create(instructorData)
      res.status(201).json(instructor)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}