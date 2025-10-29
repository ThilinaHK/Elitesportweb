import dbConnect from '../../../../lib/mongodb'
import Event from '../../../../models/Event'
import mongoose from 'mongoose'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await dbConnect()
    
    const { id } = req.query
    const { fullName, phoneNumber, ...otherData } = req.body

    if (!fullName || !phoneNumber) {
      return res.status(400).json({ message: 'Full name and phone number are required' })
    }

    const event = await Event.findById(id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    if (event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is full' })
    }

    // Check if phone number already registered
    const db = mongoose.connection.db
    const collection = db.collection('events')
    
    const existingRegistration = await collection.findOne({
      _id: new mongoose.Types.ObjectId(id),
      'participants.phoneNumber': phoneNumber
    })
    
    if (existingRegistration) {
      return res.status(400).json({ message: 'This phone number is already registered for this event' })
    }

    const participant = {
      memberName: fullName,
      phoneNumber,
      isMember: otherData.isMember || 'no',
      registrationDate: new Date()
    }
    
    await collection.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { 
        $inc: { currentParticipants: 1 },
        $push: { participants: participant }
      }
    )
    
    res.status(200).json({ message: 'Registration successful' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}