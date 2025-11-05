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
  const { id } = req.query
  await dbConnect()

  if (req.method === 'DELETE') {
    try {
      await Payment.findByIdAndDelete(id)
      res.status(200).json({ message: 'Payment deleted successfully' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  } else if (req.method === 'PUT') {
    try {
      const payment = await Payment.findByIdAndUpdate(id, req.body, { 
        new: true, 
        runValidators: true 
      })
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