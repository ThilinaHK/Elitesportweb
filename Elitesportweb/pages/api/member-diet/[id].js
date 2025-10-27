import dbConnect from '../../../lib/mongodb'
import Diet from '../../../models/Diet'

export default async function handler(req, res) {
  const { id } = req.query
  await dbConnect()

  if (req.method === 'GET') {
    try {
      const diets = await Diet.find({ memberId: id }).sort({ createdAt: -1 })
      res.status(200).json({ diets })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}