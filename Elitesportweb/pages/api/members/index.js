import dbConnect from '../../../lib/mongodb'
import Member from '../../../models/Member'

export default async function handler(req, res) {
  try {
    await dbConnect()

    if (req.method === 'GET') {
      const members = await Member.find({})
      res.json(members)
    } else if (req.method === 'POST') {
      const member = await Member.create(req.body)
      res.status(201).json(member)
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: error.message })
  }
}