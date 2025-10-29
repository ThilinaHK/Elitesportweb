import dbConnect from '../../../../lib/mongodb'
import Instructor from '../../../../models/Instructor'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await dbConnect()
    
    const { name } = req.query
    const instructor = await Instructor.findOne({ name: decodeURIComponent(name) })
    
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' })
    }

    res.status(200).json({ instructor })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}