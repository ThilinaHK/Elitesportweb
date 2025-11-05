import dbConnect from '../../../lib/mongodb'
import Notification from '../../../models/Notification'
import Member from '../../../models/Member'
import Payment from '../../../models/Payment'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await dbConnect()
    
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const currentYear = currentDate.getFullYear()
    
    // Find members who haven't paid for current month
    const members = await Member.find({ isActive: true })
    const overdueMembers = []
    
    for (const member of members) {
      const payment = await Payment.findOne({
        memberId: member._id,
        paymentMonth: `${currentYear}-${currentMonth.toString().padStart(2, '0')}`,
        verificationStatus: 'verified'
      })
      
      if (!payment) {
        overdueMembers.push(member)
      }
    }
    
    // Create payment reminder notifications
    const notifications = []
    for (const member of overdueMembers) {
      const notification = new Notification({
        title: 'Payment Reminder',
        message: `Dear ${member.fullName}, your monthly payment for ${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} is overdue. Please make your payment to continue enjoying our services.`,
        className: 'Payment Reminder',
        type: 'urgent',
        memberId: member._id,
        isSent: true
      })
      notifications.push(notification)
    }
    
    if (notifications.length > 0) {
      await Notification.insertMany(notifications)
    }
    
    res.status(200).json({ 
      message: `Generated ${notifications.length} payment reminder notifications`,
      count: notifications.length
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
