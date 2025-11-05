import dbConnect from '../../../lib/mongodb'
import Event from '../../../models/Event'

export default async function handler(req, res) {
  try {
    await dbConnect()
    
    await Event.updateOne(
      { _id: "6901c07c17caa7e8fb2b3253" },
      { $set: { currentParticipants: 0, participants: [] } }
    )
    
    res.status(200).json({ message: 'Reset successful' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
