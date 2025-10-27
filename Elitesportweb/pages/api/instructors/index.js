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
      res.json([])
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