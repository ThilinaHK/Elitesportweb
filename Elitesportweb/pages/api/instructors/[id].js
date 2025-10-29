import dbConnect from '../../../lib/mongodb'
import Instructor from '../../../models/Instructor'
import mongoose from 'mongoose'

export default async function handler(req, res) {
  const { id } = req.query
  
  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid instructor ID format' })
  }
  
  try {
    await dbConnect()
  } catch (error) {
    console.error('Database connection failed:', error)
    return res.status(500).json({ error: 'Database connection failed' })
  }

  if (req.method === 'GET') {
    try {
      const instructor = await Instructor.findById(id)
      if (!instructor) {
        return res.status(404).json({ error: 'Instructor not found' })
      }
      res.status(200).json(instructor)
    } catch (error) {
      console.error('Get error:', error)
      res.status(400).json({ error: error.message })
    }
  } else if (req.method === 'DELETE') {
    try {
      const instructor = await Instructor.findByIdAndDelete(id)
      if (!instructor) {
        return res.status(404).json({ error: 'Instructor not found' })
      }
      res.status(200).json({ message: 'Instructor deleted successfully' })
    } catch (error) {
      console.error('Delete error:', error)
      res.status(400).json({ error: error.message })
    }
  } else if (req.method === 'PUT') {
    try {
      console.log('Updating instructor:', id, req.body)
      const instructor = await Instructor.findByIdAndUpdate(id, req.body, { new: true })
      if (!instructor) {
        return res.status(404).json({ error: 'Instructor not found' })
      }
      console.log('Updated instructor:', instructor)
      res.status(200).json(instructor)
    } catch (error) {
      console.error('Update error:', error)
      res.status(400).json({ error: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}