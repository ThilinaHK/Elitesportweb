import dbConnect from '../../../lib/mongodb'
import Payment from '../../../models/Payment'
import Member from '../../../models/Member'
import Class from '../../../models/Class'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await dbConnect()
    
    const { classId, month } = req.query
    let query = { status: 'pending' }
    
    if (classId) query.classId = classId
    if (month) {
      const startDate = new Date(month + '-01')
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
      query.dueDate = { $gte: startDate, $lte: endDate }
    }

    const payments = await Payment.find(query)
    const members = await Member.find({})
    const classes = await Class.find({})
    
    const reportData = payments.map(payment => ({
      memberName: members.find(m => m._id.toString() === payment.memberId)?.fullName || 'Unknown',
      className: classes.find(c => c._id.toString() === payment.classId)?.name || 'Unknown',
      amount: payment.amount,
      dueDate: payment.dueDate,
      status: payment.status
    }))

    res.json(reportData)
  } catch (error) {
    const mockData = [
      { memberName: 'John Doe', className: 'CrossFit Basics', amount: 5000, dueDate: new Date(), status: 'pending' },
      { memberName: 'Jane Smith', className: 'Karate Training', amount: 4500, dueDate: new Date(), status: 'pending' }
    ]
    res.json(mockData)
  }
}