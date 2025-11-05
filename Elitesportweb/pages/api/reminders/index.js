import dbConnect from '../../../lib/mongodb'
import Reminder from '../../../models/Reminder'
import Member from '../../../models/Member'
import Class from '../../../models/Class'
import Payment from '../../../models/Payment'

export default async function handler(req, res) {
  try {
    await dbConnect()

    if (req.method === 'GET') {
      const reminders = await Reminder.find({}).sort({ reminderDate: -1 })
      res.json(reminders)
    } else if (req.method === 'POST') {
      if (req.body.action === 'generate') {
        // Generate reminders for overdue payments
        const currentMonth = new Date().toISOString().slice(0, 7)
        const members = await Member.find({})
        const classes = await Class.find({})
        const payments = await Payment.find({})
        
        const reminders = []
        
        for (const member of members) {
          if (member.assignedClasses) {
            for (const classId of member.assignedClasses) {
              const cls = classes.find(c => c._id.toString() === classId)
              if (cls) {
                // Check if payment exists for current month
                const hasPayment = payments.some(p => 
                  p.memberId === member._id.toString() && 
                  p.classId === classId && 
                  p.paymentType === 'monthly' &&
                  p.paymentMonth === currentMonth
                )
                
                if (!hasPayment) {
                  // Check if reminder already exists
                  const existingReminder = await Reminder.findOne({
                    memberId: member._id.toString(),
                    classId: classId,
                    dueMonth: currentMonth,
                    status: 'pending'
                  })
                  
                  if (!existingReminder) {
                    reminders.push({
                      memberId: member._id.toString(),
                      memberName: member.fullName || member.name,
                      classId: classId,
                      className: cls.name,
                      dueMonth: currentMonth,
                      amount: cls.fees?.monthly || 0
                    })
                  }
                }
              }
            }
          }
        }
        
        if (reminders.length > 0) {
          await Reminder.insertMany(reminders)
        }
        
        res.json({ message: `Generated ${reminders.length} reminders`, count: reminders.length })
      } else {
        const reminder = await Reminder.create(req.body)
        res.status(201).json(reminder)
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: error.message })
  }
}
