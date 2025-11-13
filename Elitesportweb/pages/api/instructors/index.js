import dbConnect from '../../../lib/mongodb'
import Instructor from '../../../models/Instructor'
import { fallbackInstructors } from '../../../lib/fallbackData'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

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
      
      const { id, ...instructorData } = req.body
      
      // Convert numeric fields
      if (instructorData.experience) instructorData.experience = Number(instructorData.experience)
      if (instructorData.salary) instructorData.salary = Number(instructorData.salary)
      
      // If ID provided, update existing instructor
      if (id) {
        const updatedInstructor = await Instructor.findByIdAndUpdate(id, instructorData, { new: true })
        if (!updatedInstructor) {
          return res.status(404).json({ error: 'Instructor not found' })
        }
        return res.json(updatedInstructor)
      }
      
      // Generate unique instructor ID with EL00 prefix for new instructor
      const lastInstructor = await Instructor.findOne({}, {}, { sort: { 'createdAt': -1 } })
      let nextNumber = 1
      if (lastInstructor && lastInstructor.instructorId) {
        const lastNumber = parseInt(lastInstructor.instructorId.replace('EL00', ''))
        nextNumber = lastNumber + 1
      }
      const instructorId = `EL00${nextNumber.toString().padStart(3, '0')}`
      
      instructorData.instructorId = instructorId
      const instructor = await Instructor.create(instructorData)
      res.status(201).json(instructor)
    } catch (error) {
      console.error('Instructor creation error:', error)
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: 'Validation failed', details: error.message })
      }
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Duplicate key error', details: error.message })
      }
      res.status(500).json({ error: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
