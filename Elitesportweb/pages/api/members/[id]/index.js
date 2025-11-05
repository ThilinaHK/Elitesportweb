import dbConnect from '../../../../lib/mongodb'
import Member from '../../../../models/Member'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      await dbConnect()
      let member = await Member.findById(id).catch(() => null)
      if (!member) {
        member = await Member.findOne({ memberId: id })
      }
      if (!member) {
        return res.status(404).json({ success: false, error: 'Member not found', member: null })
      }
      res.json({ success: true, member })
    } catch (error) {
      console.error('Member fetch error:', error)
      res.status(500).json({ success: false, error: error.message, member: null })
    }
  } else if (req.method === 'POST' || req.method === 'PUT') {
    try {
      await dbConnect()
      
      const memberId = req.body.id || id
      const { email, phone, username, ...updateData } = req.body
      if (!memberId) {
        return res.status(400).json({ error: 'Member ID is required' })
      }
      
      let currentMember = await Member.findById(memberId).catch(() => null)
      if (!currentMember) {
        currentMember = await Member.findOne({ memberId })
      }
      if (!currentMember) {
        return res.status(404).json({ error: 'Member not found' })
      }
      
      const actualId = currentMember._id
      
      if (email) {
        const existingEmail = await Member.findOne({ 
          email: email.toLowerCase().trim(), 
          _id: { $ne: actualId } 
        })
        if (existingEmail) {
          return res.status(400).json({ error: 'Email already exists' })
        }
      }
      
      if (phone && currentMember.phone !== phone.trim()) {
        const existingPhone = await Member.findOne({ 
          phone: phone.trim(), 
          _id: { $ne: actualId } 
        })
        if (existingPhone) {
          return res.status(400).json({ error: `Phone number ${phone} is already registered to another member` })
        }
      }
      
      if (username) {
        const existingUsername = await Member.findOne({ 
          username: username.toLowerCase().trim(), 
          _id: { $ne: actualId } 
        })
        if (existingUsername) {
          return res.status(400).json({ error: 'Username already exists' })
        }
      }
      
      const finalUpdateData = { ...updateData }
      if (email) finalUpdateData.email = email.toLowerCase().trim()
      if (phone) finalUpdateData.phone = phone.trim()
      if (username) finalUpdateData.username = username.toLowerCase().trim()
      if (finalUpdateData.weight) finalUpdateData.weight = Number(finalUpdateData.weight)
      if (finalUpdateData.height) finalUpdateData.height = Number(finalUpdateData.height)
      
      const member = await Member.findByIdAndUpdate(actualId, finalUpdateData, { 
        new: true, 
        runValidators: true 
      })
      res.json({ success: true, member })
    } catch (error) {
      console.error('Member update error:', error)
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: 'Validation failed', details: error.message })
      }
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Duplicate key error', details: error.message })
      }
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'DELETE') {
    try {
      await dbConnect()
      let member = await Member.findByIdAndDelete(id).catch(() => null)
      if (!member) {
        member = await Member.findOneAndDelete({ memberId: id })
      }
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