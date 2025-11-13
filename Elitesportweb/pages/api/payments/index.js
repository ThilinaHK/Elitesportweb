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
      const { id, ...paymentData } = req.body
      
      // If ID provided, update existing payment
      if (id) {
        const payment = await Payment.findByIdAndUpdate(id, paymentData, { new: true })
        if (!payment) {
          return res.status(404).json({ error: 'Payment not found' })
        }
        return res.json(payment)
      }
      
      // Create new payment
      const payment = await Payment.create(paymentData)
      
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
