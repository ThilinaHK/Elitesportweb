import dbConnect from '../../../lib/mongodb'
import Member from '../../../models/Member'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      await dbConnect()
      const member = await Member.findById(id)
      if (!member) {
        return res.status(404).json({ error: 'Member not found' })
      }
      res.json({ member })
    } catch (error) {
      console.error('Member fetch error:', error)
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'PUT') {
    try {
      await dbConnect()
      
      // Check if email already exists (excluding current member)
      if (req.body.email) {
        const existingMember = await Member.findOne({ 
          email: req.body.email, 
          _id: { $ne: id } 
        })
        if (existingMember) {
          return res.status(400).json({ error: 'Email already exists' })
        }
      }
      
      const member = await Member.findByIdAndUpdate(id, req.body, { new: true })
      if (!member) {
        return res.status(404).json({ error: 'Member not found' })
      }
      res.json(member)
    } catch (error) {
      console.error('Member update error:', error)
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'DELETE') {
    try {
      await dbConnect()
      const member = await Member.findByIdAndDelete(id)
      if (!member) {
        return res.status(404).json({ error: 'Member not found' })
      }
      res.json({ message: 'Member deleted successfully' })
    } catch (error) {
      console.error('Member delete error:', error)
      res.status(500).json({ error: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}