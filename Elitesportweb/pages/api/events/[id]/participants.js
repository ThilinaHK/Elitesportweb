import dbConnect from '../../../../lib/mongodb'
import Event from '../../../../models/Event'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await dbConnect()
    
    const { id } = req.query
    const event = await Event.findById(id)
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    console.log('Event participants:', event.participants)
    console.log('Event currentParticipants:', event.currentParticipants)
    
    res.status(200).json({ 
      participants: event.participants || [],
      currentParticipants: event.currentParticipants,
      debug: {
        eventId: event._id,
        participantsLength: event.participants ? event.participants.length : 0
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}