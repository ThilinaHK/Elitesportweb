import dbConnect from '../../../lib/mongodb'
import Notification from '../../../models/Notification'

export default async function handler(req, res) {
  const { id } = req.query

  await dbConnect()

  if (req.method === 'PUT') {
    try {
      const notification = await Notification.findByIdAndUpdate(id, req.body, { new: true })
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' })
      }
      res.status(200).json({ success: true, notification })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const notification = await Notification.findByIdAndDelete(id)
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' })
      }
      res.status(200).json({ success: true, message: 'Notification deleted' })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}