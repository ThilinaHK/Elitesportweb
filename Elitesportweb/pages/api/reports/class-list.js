import dbConnect from '../../../lib/mongodb'
import Class from '../../../models/Class'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await dbConnect()
    const classes = await Class.find({})
    res.json(classes)
  } catch (error) {
    const mockData = [
      { name: 'CrossFit Basics', instructor: 'John Doe', category: 'crossfit', duration: 60, capacity: 20 },
      { name: 'Karate Training', instructor: 'Jane Smith', category: 'karate', duration: 90, capacity: 15 },
      { name: 'Zumba Dance', instructor: 'Mike Johnson', category: 'zumba', duration: 45, capacity: 25 }
    ]
    res.json(mockData)
  }
}
