import dbConnect from '../../../../lib/mongodb'
import Post from '../../../../models/Post'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await dbConnect()
    
    const { postId, action, rejectionReason } = req.body
    
    if (!postId || !action) {
      return res.status(400).json({ message: 'Post ID and action are required' })
    }

    const updateData = {
      approvalStatus: action,
      approvedAt: new Date()
    }

    if (action === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason
    }

    const post = await Post.findByIdAndUpdate(postId, updateData, { new: true })
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    res.status(200).json({ message: `Post ${action} successfully`, post })
  } catch (error) {
    console.error('Error updating post approval:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
