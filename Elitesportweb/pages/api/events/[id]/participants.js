import dbConnect from '../../../../lib/mongodb'
import Event from '../../../../models/Event'

export default async function handler(req, res) {
  const { id } = req.query
  await dbConnect()

  if (req.method === 'GET') {
    try {
      const event = await Event.findById(id)
      if (!event) return res.status(404).json({ error: 'Event not found' })
      res.status(200).json({ participants: event.participants || [] })
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch participants' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}