import dbConnect from '../../../lib/mongodb'
import Member from '../../../models/Member'
import { fallbackMembers } from '../../../lib/fallbackData'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await dbConnect()
      const members = await Member.find({})
      res.json(members || [])
    } catch (error) {
      console.error('Members API error:', error)
      res.json(fallbackMembers)
    }
  } else if (req.method === 'POST') {
    try {
      await dbConnect()
      
      const { id, email, phone, username, ...updateData } = req.body
      
      // If ID provided, update existing member
      if (id) {
        let currentMember = await Member.findById(id).catch(() => null)
        if (!currentMember) {
          currentMember = await Member.findOne({ memberId: id })
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
        return res.json({ success: true, member })
      }
      
      // Create new member if no ID provided
      const existingEmail = await Member.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      
      const existingPhone = await Member.findOne({ phone });
      if (existingPhone) {
        return res.status(400).json({ error: 'Phone number already exists' });
      }
      
      if (username) {
        const existingUsername = await Member.findOne({ username });
        if (existingUsername) {
          return res.status(400).json({ error: 'Username already exists' });
        }
      }
      
      // Generate sequential member ID
      const lastMember = await Member.findOne({}, {}, { sort: { 'createdAt': -1 } })
      let nextNumber = 1
      if (lastMember && lastMember.memberId) {
        const lastNumber = parseInt(lastMember.memberId.replace('ESA', ''))
        nextNumber = lastNumber + 1
      }
      const memberId = 'ESA' + nextNumber.toString().padStart(6, '0')
      
      // Convert string numbers to actual numbers and clean username
      const memberData = {
        ...req.body,
        memberId,
        username: username ? username.toLowerCase().trim() : undefined,
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        weight: req.body.weight ? Number(req.body.weight) : undefined,
        height: req.body.height ? Number(req.body.height) : undefined
      }
      
      console.log('Creating member with data:', memberData)
      const member = await Member.create(memberData)
      console.log('Member created successfully:', member._id)
      res.status(201).json(member)
    } catch (error) {
      console.error('Member operation error:', error)
      res.status(500).json({ error: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
