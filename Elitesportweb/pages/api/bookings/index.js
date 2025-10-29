import dbConnect from '../../../lib/mongodb'
import Booking from '../../../models/Booking'
import Member from '../../../models/Member'

export default async function handler(req, res) {
  try {
    await dbConnect()

    if (req.method === 'GET') {
      const bookings = await Booking.find({}).sort({ bookingDate: -1 })
      res.json(bookings)
    } else if (req.method === 'POST') {
      const { memberEmail } = req.body
      
      // Check if user is a registered member
      const member = await Member.findOne({ email: memberEmail })
      if (!member) {
        return res.status(400).json({ 
          error: 'You must be a registered member to book classes. Please register first.',
          requiresRegistration: true
        })
      }
      
      const booking = await Booking.create({
        ...req.body,
        memberId: member._id
      })
      res.status(201).json(booking)
    } else if (req.method === 'PUT') {
      const { id } = req.query
      const booking = await Booking.findByIdAndUpdate(id, req.body, { new: true })
      res.json(booking)
    } else if (req.method === 'DELETE') {
      const { id } = req.query
      await Booking.findByIdAndDelete(id)
      res.json({ message: 'Booking deleted successfully' })
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: error.message })
  }
}