import dbConnect from '../../../lib/mongodb'
import Diet from '../../../models/Diet'

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  const { id } = req.query
  await dbConnect()

  if (req.method === 'PUT') {
    try {
      let diet = await Diet.findByIdAndUpdate(id, req.body, { new: true }).catch(() => null)
      if (!diet) {
        diet = await Diet.findOneAndUpdate({ memberId: id }, req.body, { new: true })
      }
      if (!diet) {
        return res.status(404).json({ error: 'Diet plan not found' })
      }
      res.status(200).json(diet)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  } else if (req.method === 'DELETE') {
    try {
      let diet = await Diet.findByIdAndDelete(id).catch(() => null)
      if (!diet) {
        diet = await Diet.findOneAndDelete({ memberId: id })
      }
      if (!diet) {
        return res.status(404).json({ error: 'Diet plan not found' })
      }
      res.status(200).json({ message: 'Diet plan deleted successfully' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}