import dbConnect from '../../../lib/mongodb'
import Quote from '../../../models/Quote'

export default async function handler(req, res) {
  const { id } = req.query
  await dbConnect()

  if (req.method === 'DELETE') {
    try {
      await Quote.findByIdAndDelete(id)
      res.status(200).json({ message: 'Quote deleted successfully' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  } else if (req.method === 'PUT') {
    try {
      const quote = await Quote.findByIdAndUpdate(id, req.body, { new: true })
      res.status(200).json(quote)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}