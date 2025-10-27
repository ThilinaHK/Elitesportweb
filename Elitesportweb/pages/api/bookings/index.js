import dbConnect from '../../../lib/mongodb'
import Booking from '../../../models/Booking'

export default async function handler(req, res) {
  try {
    await dbConnect()

    if (req.method === 'GET') {
      const bookings = await Booking.find({}).sort({ bookingDate: -1 })
      res.json(bookings)
    } else if (req.method === 'POST') {
      const booking = await Booking.create(req.body)
      res.status(201).json(booking)
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: error.message })
  }
}