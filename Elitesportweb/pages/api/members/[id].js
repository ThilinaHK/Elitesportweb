import dbConnect from '../../../lib/mongodb'
import Member from '../../../models/Member'
import cors from '../../../lib/cors'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req, res) {
  cors(req, res)
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      await dbConnect()
    } catch (error) {
      console.error('Database connection failed:', error)
      return res.status(500).json({ success: false, error: 'Database connection failed', member: null })
    }
    
    try {
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
  } else if (req.method === 'PUT') {
    try {
      await dbConnect()
      
      // Find the member first (try both _id and memberId)
      let currentMember = await Member.findById(id).catch(() => null)
      if (!currentMember) {
        currentMember = await Member.findOne({ memberId: id })
      }
      if (!currentMember) {
        return res.status(404).json({ error: 'Member not found' })
      }
      
      const actualId = currentMember._id
      
      // Check if email, phone, or username already exists (excluding current member)
      const { email, phone, username } = req.body;
      
      if (email) {
        const existingEmail = await Member.findOne({ 
          email: email.toLowerCase().trim(), 
          _id: { $ne: actualId } 
        });
        if (existingEmail) {
          return res.status(400).json({ error: 'Email already exists' });
        }
      }
      
      if (phone && currentMember.phone !== phone.trim()) {
        const existingPhone = await Member.findOne({ 
          phone: phone.trim(), 
          _id: { $ne: actualId } 
        });
        if (existingPhone) {
          return res.status(400).json({ error: `Phone number ${phone} is already registered to another member` });
        }
      }
      
      if (username) {
        const existingUsername = await Member.findOne({ 
          username: username.toLowerCase().trim(), 
          _id: { $ne: actualId } 
        });
        if (existingUsername) {
          return res.status(400).json({ error: 'Username already exists' });
        }
      }
      
      // Clean data before update
      const updateData = { ...req.body };
      if (updateData.email) updateData.email = updateData.email.toLowerCase().trim();
      if (updateData.phone) updateData.phone = updateData.phone.trim();
      if (updateData.username) updateData.username = updateData.username.toLowerCase().trim();
      if (updateData.weight) updateData.weight = Number(updateData.weight);
      if (updateData.height) updateData.height = Number(updateData.height);
      
      const member = await Member.findByIdAndUpdate(actualId, updateData, { 
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