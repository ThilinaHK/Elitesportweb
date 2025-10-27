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
      // Return mock data when DB is unavailable
      const mockClasses = [
        { _id: '1', name: 'CrossFit Basics', instructor: 'John Doe', time: '09:00 AM', duration: 60, category: 'crossfit' },
        { _id: '2', name: 'Karate Training', instructor: 'Jane Smith', time: '10:30 AM', duration: 90, category: 'karate' },
        { _id: '3', name: 'Zumba Dance', instructor: 'Mike Johnson', time: '06:00 PM', duration: 45, category: 'zumba' }
      ]
      res.json(mockClasses)
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