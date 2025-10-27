import dbConnect from '../../../lib/mongodb'
import Post from '../../../models/Post'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await dbConnect()
      const posts = await Post.find({}).sort({ createdAt: -1 })
      res.json(posts || [])
    } catch (error) {
      console.error('Posts API error:', error)
      res.json([])
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