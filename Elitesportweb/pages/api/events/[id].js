import dbConnect from '../../../lib/mongodb'
import Event from '../../../models/Event'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req, res) {
  await dbConnect()
  const { id } = req.query

  if (req.method === 'PUT') {
    try {
      const event = await Event.findByIdAndUpdate(id, req.body, { 
        new: true, 
        runValidators: true 
      })
      if (!event) {
        return res.status(404).json({ error: 'Event not found' })
      }
      res.status(200).json(event)
    } catch (error) {
      console.error('Event update error:', error)
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: 'Validation failed', details: error.message })
      }
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await Event.findByIdAndDelete(id)
      res.status(200).json({ message: 'Event deleted' })
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete event' })
    }
  }
}