import dbConnect from '../../../lib/mongodb'
import Post from '../../../models/Post'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await dbConnect()
      const posts = await Post.find({ approvalStatus: 'approved' }).sort({ createdAt: -1 })
      res.json(posts || [])
    } catch (error) {
      console.error('Posts API error:', error)
      // Return mock data when DB is unavailable
      const mockPosts = [
        { _id: '1', title: 'CrossFit Workout Basics', videoId: 'dQw4w9WgXcQ', category: 'crossfit', type: 'trending', isActive: true, description: 'Learn basic CrossFit movements' },
        { _id: '2', title: 'Karate Kata Forms', videoId: 'dQw4w9WgXcQ', category: 'karate', type: 'featured', isActive: true, description: 'Traditional karate forms' },
        { _id: '3', title: 'Zumba Dance Moves', videoId: 'dQw4w9WgXcQ', category: 'zumba', type: 'normal', isActive: true, description: 'Fun dance workout' }
      ]
      res.json(mockPosts)
    }
  } else if (req.method === 'POST') {
    try {
      await dbConnect()
      let postData = { ...req.body }
      
      // Handle video posts
      if (req.body.type !== 'article' && req.body.youtubeUrl) {
        const videoId = req.body.youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
        if (!videoId) {
          return res.status(400).json({ error: 'Invalid YouTube URL' })
        }
        postData.videoId = videoId
      }
      
      // Handle article posts
      if (req.body.type === 'article') {
        if (!req.body.content || !req.body.excerpt) {
          return res.status(400).json({ error: 'Articles require content and excerpt' })
        }
      }
      
      // Set approval status to pending for new posts
      postData.approvalStatus = 'pending'
      const post = await Post.create(postData)
      res.status(201).json(post)
    } catch (error) {
      console.error('API Error:', error)
      res.status(500).json({ error: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}