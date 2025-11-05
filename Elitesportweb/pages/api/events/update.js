import dbConnect from '../../../lib/mongodb'
import Event from '../../../models/Event'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  if (req.method === 'POST') {
    try {
      await dbConnect()
      const { id, ...updateData } = req.body
      if (!id) {
        return res.status(400).json({ error: 'Event ID is required' })
      }
      let event = await Event.findByIdAndUpdate(id, updateData, { new: true }).catch(() => null)
      if (!event) {
        event = await Event.findOneAndUpdate({ eventId: id }, updateData, { new: true })
      }
      if (!event) return res.status(404).json({ error: 'Event not found' })
      res.status(200).json(event)
    } catch (error) {
      res.status(500).json({ error: 'Failed to update event' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
