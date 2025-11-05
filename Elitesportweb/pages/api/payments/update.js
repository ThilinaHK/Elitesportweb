import dbConnect from '../../../lib/mongodb'
import Payment from '../../../models/Payment'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  if (req.method === 'POST') {
    try {
      await dbConnect()
      const { id, ...updateData } = req.body
      if (!id) {
        return res.status(400).json({ error: 'Payment ID is required' })
      }
      let payment = await Payment.findByIdAndUpdate(id, updateData, { 
        new: true, 
        runValidators: true 
      }).catch(() => null)
      if (!payment) {
        payment = await Payment.findOneAndUpdate({ memberId: id }, updateData, { 
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