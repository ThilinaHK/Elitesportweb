import dbConnect from '../../../lib/mongodb'
import Reminder from '../../../models/Reminder'

export default async function handler(req, res) {
  try {
    await dbConnect()

    if (req.method === 'POST') {
      const { reminderId, method } = req.body // method: 'email' or 'sms'
      
      const reminder = await Reminder.findById(reminderId)
      if (!reminder) {
        return res.status(404).json({ error: 'Reminder not found' })
      }

      // Simulate sending email/SMS (replace with actual service)
      if (method === 'email') {
        // Email service integration would go here
        console.log(`Sending email reminder to ${reminder.memberName} for ${reminder.className}`)
      } else if (method === 'sms') {
        // SMS service integration would go here
        console.log(`Sending SMS reminder to ${reminder.memberName} for ${reminder.className}`)
      }

      // Update reminder count
      await Reminder.findByIdAndUpdate(reminderId, { 
        $inc: { reminderCount: 1 },
        reminderDate: new Date()
      })

      res.json({ message: `${method} reminder sent successfully` })
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: error.message })
  }
}
