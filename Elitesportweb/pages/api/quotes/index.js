import dbConnect from '../../../lib/mongodb'
import Quote from '../../../models/Quote'

export default async function handler(req, res) {
  try {
    await dbConnect()

    if (req.method === 'GET') {
      const quotes = await Quote.find({}).sort({ createdAt: -1 })
      res.json(quotes)
    } else if (req.method === 'POST') {
      const { id, ...quoteData } = req.body
      
      // If ID provided, update existing quote
      if (id) {
        const updatedQuote = await Quote.findByIdAndUpdate(id, quoteData, { new: true })
        if (!updatedQuote) {
          return res.status(404).json({ error: 'Quote not found' })
        }
        return res.json(updatedQuote)
      }
      
      // Create new quote
      const quote = await Quote.create(quoteData)
      res.status(201).json(quote)
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: error.message })
  }
}
