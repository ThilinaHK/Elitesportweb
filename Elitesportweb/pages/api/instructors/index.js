import dbConnect from '../../../lib/mongodb'
import Instructor from '../../../models/Instructor'

export default async function handler(req, res) {
  try {
    await dbConnect()

    if (req.method === 'GET') {
      const instructors = await Instructor.find({}).sort({ name: 1 })
      res.json(instructors)
    } else if (req.method === 'POST') {
      const instructor = await Instructor.create(req.body)
      res.status(201).json(instructor)
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}