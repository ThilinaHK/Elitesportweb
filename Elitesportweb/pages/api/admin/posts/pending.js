import dbConnect from '../../../../lib/mongodb'
import Post from '../../../../models/Post'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await dbConnect()
    
    const pendingPosts = await Post.find({ approvalStatus: 'pending' })
      .populate('instructorId', 'name')
      .sort({ createdAt: -1 })

    res.status(200).json(pendingPosts)
  } catch (error) {
    console.error('Error fetching pending posts:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}