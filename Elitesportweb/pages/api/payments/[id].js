import dbConnect from '../../../lib/mongodb'
import Payment from '../../../models/Payment'

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
      const payment = await Payment.findByIdAndUpdate(id, req.body, { new: true })
      res.status(200).json(payment)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}