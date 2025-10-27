import dbConnect from '../../../lib/mongodb'
import Class from '../../../models/Class'

export default async function handler(req, res) {
  try {
    await dbConnect()

    if (req.method === 'GET') {
      const classes = await Class.find({}).sort({ createdAt: -1 })
      res.json(classes)
    } else if (req.method === 'POST') {
      const newClass = await Class.create(req.body)
      res.status(201).json(newClass)
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}