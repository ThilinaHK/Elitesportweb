import dbConnect from '../../../lib/mongodb'
import Event from '../../../models/Event'

export default async function handler(req, res) {
  await dbConnect()

  if (req.method === 'GET') {
    try {
      const events = await Event.find({ isPublished: true }).sort({ date: 1 })
      res.status(200).json(events)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch events' })
    }
  }

  if (req.method === 'POST') {
    try {
      const event = await Event.create(req.body)
      res.status(201).json(event)
    } catch (error) {
      res.status(400).json({ error: 'Failed to create event' })
    }
  }
}
