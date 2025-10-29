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
      
      // Check if email already exists
      const existingMember = await Member.findOne({ email: req.body.email })
      if (existingMember) {
        return res.status(400).json({ error: 'Email already exists' })
      }
      
      // Convert string numbers to actual numbers
      const memberData = {
        ...req.body,
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