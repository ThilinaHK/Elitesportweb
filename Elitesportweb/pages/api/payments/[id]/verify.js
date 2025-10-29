import dbConnect from '../../../../lib/mongodb'
import Payment from '../../../../models/Payment'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await dbConnect()
    
    const { id } = req.query
    const payment = await Payment.findById(id)
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' })
    }

    await Payment.findByIdAndUpdate(id, {
      verificationStatus: 'requested',
      verificationRequestDate: new Date()
    })

    res.status(200).json({ message: 'Verification requested successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}