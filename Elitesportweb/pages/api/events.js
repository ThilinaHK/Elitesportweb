import dbConnect from '../../lib/mongodb'
import Event from '../../models/Event'

export default async function handler(req, res) {
  await dbConnect()

  switch (req.method) {
    case 'GET':
      try {
        const events = await Event.find({}).sort({ date: 1 })
        res.status(200).json(events)
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch events' })
      }
      break

    case 'POST':
      try {
        const event = new Event(req.body)
        await event.save()
        res.status(201).json(event)
      } catch (error) {
        res.status(500).json({ error: 'Failed to create event' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}