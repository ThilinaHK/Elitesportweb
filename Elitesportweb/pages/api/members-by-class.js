import dbConnect from '../../lib/mongodb'
import Member from '../../models/Member'
import Class from '../../models/Class'

export default async function handler(req, res) {
  await dbConnect()

  if (req.method === 'GET') {
    try {
      const { classId } = req.query
      
      if (!classId) {
        return res.status(400).json({ error: 'Class ID is required' })
      }

      // Get class details
      const classDetails = await Class.findById(classId)
      if (!classDetails) {
        return res.status(404).json({ error: 'Class not found' })
      }

      // Get members assigned to this class
      const members = await Member.find({ 
        assignedClasses: classId,
        status: 'active'
      }).select('_id fullName email phone membershipType assignedClasses')

      res.status(200).json({
        class: classDetails,
        members: members,
        count: members.length
      })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
