import dbConnect from '../../../../../lib/mongodb'
import mongoose from 'mongoose'

export default async function handler(req, res) {
  const { id, phone } = req.query

  try {
    await dbConnect()
    const db = mongoose.connection.db
    const collection = db.collection('events')

    if (req.method === 'DELETE') {
      await collection.updateOne(
        { _id: new mongoose.Types.ObjectId(id) },
        { 
          $pull: { participants: { phoneNumber: phone } },
          $inc: { currentParticipants: -1 }
        }
      )
      res.status(200).json({ message: 'Participant removed successfully' })
    } 
    else if (req.method === 'PUT') {
      const updatedParticipant = req.body
      await collection.updateOne(
        { _id: new mongoose.Types.ObjectId(id), 'participants.phoneNumber': phone },
        { $set: { 'participants.$': updatedParticipant } }
      )
      res.status(200).json({ message: 'Participant updated successfully' })
    }
    else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}