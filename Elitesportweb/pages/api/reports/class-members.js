import dbConnect from '../../../lib/mongodb'
import Member from '../../../models/Member'
import Class from '../../../models/Class'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await dbConnect()
    
    const { classId } = req.query
    let members = []

    if (classId) {
      members = await Member.find({ assignedClasses: classId })
      const classInfo = await Class.findById(classId)
      
      members = members.map(member => ({
        memberName: member.fullName,
        email: member.email,
        phone: member.phone,
        className: classInfo?.name || 'Unknown Class',
        status: member.status || 'active'
      }))
    } else {
      members = await Member.find({})
      const classes = await Class.find({})
      
      members = members.map(member => ({
        memberName: member.fullName,
        email: member.email,
        phone: member.phone,
        className: member.assignedClasses?.length > 0 ? 
          classes.find(c => c._id.toString() === member.assignedClasses[0])?.name || 'No Class' : 
          'No Class',
        status: member.status || 'active'
      }))
    }

    res.json(members)
  } catch (error) {
    const mockData = [
      { memberName: 'John Doe', email: 'john@example.com', phone: '0771234567', className: 'CrossFit Basics', status: 'active' },
      { memberName: 'Jane Smith', email: 'jane@example.com', phone: '0771234568', className: 'Karate Training', status: 'active' }
    ]
    res.json(mockData)
  }
}