import dbConnect from '../../../lib/mongodb'
import Class from '../../../models/Class'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await dbConnect()
      const classes = await Class.find({}).sort({ createdAt: -1 })
      res.json(classes || [])
    } catch (error) {
      console.error('Classes API error:', error)
      res.json([])
    }
  } else if (req.method === 'POST') {
    try {
      await dbConnect()
      const newClass = await Class.create(req.body)
      res.status(201).json(newClass)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}