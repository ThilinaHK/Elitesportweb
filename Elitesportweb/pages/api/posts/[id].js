import dbConnect from '../../../lib/mongodb'
import Post from '../../../models/Post'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req, res) {
  const { id } = req.query
  await dbConnect()

  if (req.method === 'DELETE') {
    try {
      await Post.findByIdAndDelete(id)
      res.status(200).json({ message: 'Post deleted successfully' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  } else if (req.method === 'PUT') {
    try {
      const updateData = { ...req.body }
      
      // Handle video posts
      if (req.body.type !== 'article' && req.body.youtubeUrl) {
        const videoId = req.body.youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
        if (!videoId) {
          return res.status(400).json({ error: 'Invalid YouTube URL' })
        }
        updateData.videoId = videoId
      }
      
      // Handle article posts
      if (req.body.type === 'article') {
        if (!req.body.content || !req.body.excerpt) {
          return res.status(400).json({ error: 'Articles require content and excerpt' })
        }
      }
      
      const post = await Post.findByIdAndUpdate(id, updateData, { 
        new: true, 
        runValidators: true 
      })
      if (!post) {
        return res.status(404).json({ error: 'Post not found' })
      }
      res.status(200).json(post)
    } catch (error) {
      console.error('Post update error:', error)
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: 'Validation failed', details: error.message })
      }
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}