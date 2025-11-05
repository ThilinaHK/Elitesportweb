import dbConnect from '../../../lib/mongodb'
import Salary from '../../../models/Salary'

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
      await Salary.findByIdAndDelete(id)
      res.status(200).json({ message: 'Salary deleted successfully' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  } else if (req.method === 'PUT') {
    try {
      const updateData = { ...req.body }
      
      // Convert numeric fields
      if (updateData.amount) updateData.amount = Number(updateData.amount)
      if (updateData.bonus) updateData.bonus = Number(updateData.bonus)
      
      const salary = await Salary.findByIdAndUpdate(id, updateData, { 
        new: true, 
        runValidators: true 
      })
      if (!salary) {
        return res.status(404).json({ error: 'Salary not found' })
      }
      res.status(200).json(salary)
    } catch (error) {
      console.error('Salary update error:', error)
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: 'Validation failed', details: error.message })
      }
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}