import dbConnect from '../../lib/mongodb'
import Diet from '../../models/Diet'

export default async function handler(req, res) {
  await dbConnect()

  if (req.method === 'GET') {
    try {
      const diets = await Diet.find().sort({ createdAt: -1 })
      res.status(200).json(diets)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  } else if (req.method === 'POST') {
    try {
      const { id, ...dietData } = req.body
      
      // If ID provided, update existing diet
      if (id) {
        const diet = await Diet.findByIdAndUpdate(id, dietData, { new: true })
        if (!diet) {
          return res.status(404).json({ error: 'Diet not found' })
        }
        return res.json(diet)
      }
      
      // Create new diet
      const diet = await Diet.create(dietData)
      res.status(201).json(diet)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
