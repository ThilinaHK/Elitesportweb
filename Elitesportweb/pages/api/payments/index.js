import dbConnect from '../../../lib/mongodb'
import Payment from '../../../models/Payment'
import Member from '../../../models/Member'
import { sendPaymentEmail, sendPaymentSMS } from '../../../lib/notifications'

export default async function handler(req, res) {
  try {
    await dbConnect()

    if (req.method === 'GET') {
      const payments = await Payment.find({}).sort({ paymentDate: -1 })
      res.json(payments)
    } else if (req.method === 'POST') {
      const payment = await Payment.create(req.body)
      
      // Send notifications after successful payment
      try {
        const member = await Member.findOne({ memberId: payment.memberId })
        if (member) {
          await sendPaymentEmail(member.email, member.fullName, payment)
          await sendPaymentSMS(member.phone, member.fullName, payment)
        }
      } catch (notificationError) {
        console.error('Notification error:', notificationError)
      }
      
      res.status(201).json(payment)
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: error.message })
  }
}
