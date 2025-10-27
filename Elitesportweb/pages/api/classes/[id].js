import dbConnect from '../../../lib/mongodb'
import Class from '../../../models/Class'

export default async function handler(req, res) {
  const { id } = req.query
  
  try {
    await dbConnect()
  } catch (error) {
    console.error('Database connection failed:', error)
    return res.status(500).json({ error: 'Database connection failed' })
  }

  if (req.method === 'DELETE') {
    try {
      const deletedClass = await Class.findByIdAndDelete(id)
      if (!deletedClass) {
        return res.status(404).json({ error: 'Class not found' })
      }
      res.status(200).json({ message: 'Class deleted successfully' })
    } catch (error) {
      console.error('Delete error:', error)
      res.status(400).json({ error: error.message })
    }
  } else if (req.method === 'PUT') {
    try {
      const updatedClass = await Class.findByIdAndUpdate(id, req.body, { new: true })
      if (!updatedClass) {
        return res.status(404).json({ error: 'Class not found' })
      }
      res.status(200).json(updatedClass)
    } catch (error) {
      console.error('Update error:', error)
      res.status(400).json({ error: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}