import dbConnect from '../../../lib/mongodb'
import Member from '../../../models/Member'
import Class from '../../../models/Class'
import Payment from '../../../models/Payment'

export default async function handler(req, res) {
  try {
    await dbConnect()

    if (req.method === 'GET') {
      const { month } = req.query // YYYY-MM format
      const currentMonth = month || new Date().toISOString().slice(0, 7)
      
      const members = await Member.find({})
      const classes = await Class.find({})
      const payments = await Payment.find({
        paymentType: 'monthly',
        paymentDate: {
          $gte: new Date(currentMonth + '-01'),
          $lt: new Date(new Date(currentMonth + '-01').getFullYear(), new Date(currentMonth + '-01').getMonth() + 1, 1)
        }
      })

      const paymentStatus = []

      for (const member of members) {
        if (member.assignedClasses && member.assignedClasses.length > 0) {
          for (const classId of member.assignedClasses) {
            const cls = classes.find(c => c._id.toString() === classId)
            if (cls) {
              const hasPaid = payments.some(p => 
                p.memberId === member._id.toString() && 
                p.classId === classId
              )
              
              paymentStatus.push({
                memberId: member._id,
                memberName: member.fullName || member.name,
                memberEmail: member.email,
                memberPhone: member.phone,
                classId: classId,
                className: cls.name,
                amount: cls.fees?.monthly || 0,
                month: currentMonth,
                status: hasPaid ? 'paid' : 'unpaid'
              })
            }
          }
        }
      }

      res.json(paymentStatus)
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: error.message })
  }
}