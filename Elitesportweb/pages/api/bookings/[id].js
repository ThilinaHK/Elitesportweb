import dbConnect from '../../../lib/mongodb'
import Booking from '../../../models/Booking'
import Member from '../../../models/Member'

export default async function handler(req, res) {
  const { id } = req.query

  try {
    await dbConnect()

    if (req.method === 'PUT') {
      const booking = await Booking.findByIdAndUpdate(id, req.body, { new: true })
      res.json(booking)
    } else if (req.method === 'DELETE') {
      await Booking.findByIdAndDelete(id)
      res.json({ message: 'Booking deleted successfully' })
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}