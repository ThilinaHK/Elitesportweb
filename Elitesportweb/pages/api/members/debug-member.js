import dbConnect from '../../../lib/mongodb'
import Member from '../../../models/Member'
import cors from '../../../lib/cors'

export default async function handler(req, res) {
  cors(req, res)
  
  if (req.method === 'GET') {
    try {
      await dbConnect()
      
      const targetId = '68fd9649d0e2186827a15d0b'
      
      // Try to find by MongoDB _id
      let member = await Member.findById(targetId).catch(() => null)
      
      if (!member) {
        // Try to find by custom memberId field
        member = await Member.findOne({ memberId: targetId })
      }
      
      if (!member) {
        // Get all members to see the ID format
        const allMembers = await Member.find({}).limit(5).select('_id memberId fullName')
        return res.json({ 
          success: false, 
          message: 'Member not found',
          targetId,
          sampleMembers: allMembers
        })
      }
      
      res.json({ success: true, member })
    } catch (error) {
      console.error('Debug error:', error)
      res.status(500).json({ error: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}