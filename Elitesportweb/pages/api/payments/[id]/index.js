import dbConnect from '../../../../lib/mongodb'
import Payment from '../../../../models/Payment'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  const { id } = req.query
  await dbConnect()

  if (req.method === 'DELETE') {
    try {
      let payment = await Payment.findByIdAndDelete(id).catch(() => null)
      if (!payment) {
        payment = await Payment.findOneAndDelete({ memberId: id })
      }
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' })
      }
      res.status(200).json({ message: 'Payment deleted successfully' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  } else if (req.method === 'POST') {
    try {
      const { id: paymentId, ...updateData } = req.body
      if (!paymentId) {
        return res.status(400).json({ error: 'Payment ID is required in request body' })
      }
      let payment = await Payment.findByIdAndUpdate(paymentId, updateData, { 
        new: true, 
        runValidators: true 
      }).catch(() => null)
      if (!payment) {
        payment = await Payment.findOneAndUpdate({ memberId: paymentId }, updateData, { 
          new: true, 
          runValidators: true 
        })
      }
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' })
      }
      res.status(200).json(payment)
    } catch (error) {
      console.error('Payment update error:', error)
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: 'Validation failed', details: error.message })
      }
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}