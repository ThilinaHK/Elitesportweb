import dbConnect from '../../lib/mongodb'
import Diet from '../../models/Diet'
import Member from '../../models/Member'
import Class from '../../models/Class'

export default async function handler(req, res) {
  await dbConnect()

  if (req.method === 'GET') {
    try {
      const { classId, memberId } = req.query
      
      let query = {}
      if (classId) {
        // Get members assigned to this class
        const members = await Member.find({ assignedClasses: classId })
        const memberIds = members.map(m => m._id)
        query.memberId = { $in: memberIds }
      }
      if (memberId) {
        query.memberId = memberId
      }

      const diets = await Diet.find(query).sort({ createdAt: -1 })
      res.status(200).json(diets)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  } else if (req.method === 'POST') {
    try {
      const { memberId, planName, description, meals, calories, duration, notes, classId } = req.body
      
      // Get member details
      const member = await Member.findById(memberId)
      if (!member) {
        return res.status(404).json({ error: 'Member not found' })
      }

      const diet = await Diet.create({
        memberId,
        memberName: member.fullName || member.name,
        planName,
        description,
        meals,
        calories,
        duration,
        notes,
        classId
      })
      
      res.status(201).json(diet)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
