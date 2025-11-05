import dbConnect from '../../../lib/mongodb'
import Event from '../../../models/Event'

export default async function handler(req, res) {
  try {
    await dbConnect()
    
    const testParticipant = {
      memberName: "John Doe",
      phoneNumber: "0771234567",
      registrationDate: new Date()
    }
    
    await Event.updateOne(
      { _id: "6901c07c17caa7e8fb2b3253" },
      { 
        $push: { participants: testParticipant },
        $inc: { currentParticipants: 1 }
      }
    )
    
    res.status(200).json({ message: 'Test participant added' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
