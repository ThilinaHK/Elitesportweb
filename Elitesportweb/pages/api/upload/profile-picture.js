import dbConnect from '../../../lib/mongodb'
import Member from '../../../models/Member'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await dbConnect()

    // Simple base64 image handling
    const { imageData, memberId } = req.body

    if (!imageData || !memberId) {
      return res.status(400).json({ message: 'Missing image data or member ID' })
    }

    // Update member profile picture in database
    await Member.findByIdAndUpdate(memberId, { profilePicture: imageData })

    res.status(200).json({ profilePicture: imageData })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}