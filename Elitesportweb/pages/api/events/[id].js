import dbConnect from '../../../lib/mongodb'
import Event from '../../../models/Event'

export default async function handler(req, res) {
  const { id } = req.query
  await dbConnect()

  switch (req.method) {
    case 'PUT':
      try {
        let event = await Event.findByIdAndUpdate(id, req.body, { new: true }).catch(() => null)
        if (!event) {
          event = await Event.findOneAndUpdate({ eventId: id }, req.body, { new: true })
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
      res.setHeader('Allow', ['PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}