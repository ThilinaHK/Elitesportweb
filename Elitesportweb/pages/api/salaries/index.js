import dbConnect from '../../../lib/mongodb'
import Salary from '../../../models/Salary'

export default async function handler(req, res) {
  try {
    await dbConnect()

    if (req.method === 'GET') {
      const salaries = await Salary.find({}).sort({ month: -1 })
      res.json(salaries)
    } else if (req.method === 'POST') {
      const { id, ...salaryData } = req.body
      
      // If ID provided, update existing salary
      if (id) {
        const updatedSalary = await Salary.findByIdAndUpdate(id, salaryData, { new: true })
        if (!updatedSalary) {
          return res.status(404).json({ error: 'Salary not found' })
        }
        return res.json(updatedSalary)
      }
      
      // Create new salary
      const salary = await Salary.create(salaryData)
      res.status(201).json(salary)
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: error.message })
  }
}
