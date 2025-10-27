import dbConnect from '../../../lib/mongodb'
import Instructor from '../../../models/Instructor'

export default async function handler(req, res) {
  const { id } = req.query
  await dbConnect()

  if (req.method === 'DELETE') {
    try {
      await Instructor.findByIdAndDelete(id)
      res.status(200).json({ message: 'Instructor deleted successfully' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  } else if (req.method === 'PUT') {
    try {
      const instructor = await Instructor.findByIdAndUpdate(id, req.body, { new: true })
      res.status(200).json(instructor)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}