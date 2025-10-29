import dbConnect from '../../../lib/mongodb'
import Event from '../../../models/Event'

export default async function handler(req, res) {
  await dbConnect()
  const { id } = req.query

  if (req.method === 'PUT') {
    try {
      const event = await Event.findByIdAndUpdate(id, req.body, { new: true })
      res.status(200).json(event)
    } catch (error) {
      res.status(400).json({ error: 'Failed to update event' })
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