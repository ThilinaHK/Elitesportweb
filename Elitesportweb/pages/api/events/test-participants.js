import dbConnect from '../../../lib/mongodb'
import Event from '../../../models/Event'

export default async function handler(req, res) {
  try {
    await dbConnect()
    
    const events = await Event.find({})
    const eventData = events.map(event => ({
      id: event._id,
      title: event.title,
      currentParticipants: event.currentParticipants,
      participantsArray: event.participants || [],
      participantsCount: event.participants ? event.participants.length : 0
    }))
    
    res.status(200).json(eventData)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
