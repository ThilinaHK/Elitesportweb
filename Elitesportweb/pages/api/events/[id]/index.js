import dbConnect from '../../../../lib/mongodb'
import Event from '../../../../models/Event'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  const { id } = req.query
  await dbConnect()

  switch (req.method) {
    case 'POST':
      try {
        const { id: eventId, ...updateData } = req.body
        if (!eventId) {
          return res.status(400).json({ error: 'Event ID is required' })
        }
        let event = await Event.findByIdAndUpdate(eventId, updateData, { new: true }).catch(() => null)
        if (!event) {
          event = await Event.findOneAndUpdate({ eventId }, updateData, { new: true })
        }
        if (!event) return res.status(404).json({ error: 'Event not found' })
        res.status(200).json(event)
      } catch (error) {
        res.status(500).json({ error: 'Failed to update event' })
      }
      break

    case 'DELETE':
      try {
        const event = await Event.findByIdAndDelete(id)
        if (!event) return res.status(404).json({ error: 'Event not found' })
        res.status(200).json({ message: 'Event deleted successfully' })
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete event' })
      }
      break

    default:
      res.setHeader('Allow', ['POST', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}