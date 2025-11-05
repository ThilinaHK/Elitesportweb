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
      
      // Check if email, phone, or username already exists
      const { email, phone, username } = req.body;
      
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
      console.error('Member creation error:', error)
      res.status(500).json({ error: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
