import dbConnect from '../../../lib/mongodb'
import Class from '../../../models/Class'

export default async function handler(req, res) {
  const { id } = req.query
  await dbConnect()

  if (req.method === 'DELETE') {
    try {
      await Class.findByIdAndDelete(id)
      res.status(200).json({ message: 'Class deleted successfully' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  } else if (req.method === 'PUT') {
    try {
      const updatedClass = await Class.findByIdAndUpdate(id, req.body, { new: true })
      res.status(200).json(updatedClass)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}