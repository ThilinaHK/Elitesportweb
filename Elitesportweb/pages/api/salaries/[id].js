import dbConnect from '../../../lib/mongodb'
import Salary from '../../../models/Salary'

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
      const salary = await Salary.findByIdAndUpdate(id, req.body, { new: true })
      res.status(200).json(salary)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}