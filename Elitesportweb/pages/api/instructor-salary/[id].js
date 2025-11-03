import dbConnect from '../../../lib/mongodb'
import SalaryHistory from '../../../models/SalaryHistory'
import mongoose from 'mongoose'

export default async function handler(req, res) {
  const { id } = req.query

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid instructor ID' })
  }

  await dbConnect()

  if (req.method === 'GET') {
    try {
      const salaryHistory = await SalaryHistory.find({ instructorId: id })
        .sort({ month: -1 })

      res.status(200).json({ salaryHistory })
    } catch (error) {
      console.error('Error fetching salary history:', error)
      res.status(500).json({ error: 'Failed to fetch salary history' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}