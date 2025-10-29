import dbConnect from '../../../lib/mongodb'
import Payment from '../../../models/Payment'
import Member from '../../../models/Member'
import { sendOverdueEmail, sendOverdueSMS } from '../../../lib/notifications'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await dbConnect()

    // Find overdue payments
    const overduePayments = await Payment.find({ status: 'overdue' })
    
    const notifications = []
    
    for (const payment of overduePayments) {
      try {
        const member = await Member.findOne({ memberId: payment.memberId })
        if (member) {
          await sendOverdueEmail(member.email, member.fullName, payment)
          await sendOverdueSMS(member.phone, member.fullName, payment)
          notifications.push({ memberId: payment.memberId, status: 'sent' })
        }
      } catch (error) {
        notifications.push({ memberId: payment.memberId, status: 'failed', error: error.message })
      }
    }

    res.json({ 
      message: 'Overdue notifications processed',
      total: overduePayments.length,
      notifications 
    })
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: error.message })
  }
}