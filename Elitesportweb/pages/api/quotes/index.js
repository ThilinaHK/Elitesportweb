import dbConnect from '../../../lib/mongodb'
import Quote from '../../../models/Quote'

export default async function handler(req, res) {
  try {
    await dbConnect()

    if (req.method === 'GET') {
      const quotes = await Quote.find({}).sort({ createdAt: -1 })
      res.json(quotes)
    } else if (req.method === 'POST') {
      const quote = await Quote.create(req.body)
      res.status(201).json(quote)
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: error.message })
  }
}
