import dbConnect from '../../../lib/mongodb'
import Notification from '../../../models/Notification'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await dbConnect()
    
    const now = new Date()
    
    // Find notifications that are scheduled and due to be sent
    const dueNotifications = await Notification.find({
      scheduledDate: { $lte: now },
      isSent: false,
      isActive: true
    })
    
    // Mark them as sent
    await Notification.updateMany(
      {
        scheduledDate: { $lte: now },
        isSent: false,
        isActive: true
      },
      { $set: { isSent: true } }
    )
    
    res.status(200).json({ 
      message: `${dueNotifications.length} notifications sent`,
      count: dueNotifications.length
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
