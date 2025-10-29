import dbConnect from '../../../lib/mongodb'
import Event from '../../../models/Event'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await dbConnect()
    
    // Add participants array to all events that don't have it
    const result = await Event.updateMany(
      { participants: { $exists: false } },
      { $set: { participants: [] } }
    )
    
    res.status(200).json({ 
      message: 'Fixed participants field',
      modifiedCount: result.modifiedCount
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}