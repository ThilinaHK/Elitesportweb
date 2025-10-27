import dbConnect from '../../../lib/mongodb'
import Member from '../../../models/Member'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await dbConnect()
      const members = await Member.find({})
      res.json(members || [])
    } catch (error) {
      console.error('Members API error:', error)
      res.json([])
    }
  } else if (req.method === 'POST') {
    try {
      await dbConnect()
      const member = await Member.create(req.body)
      res.status(201).json(member)
    } catch (error) {
      console.error('API Error:', error)
      res.status(500).json({ error: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}