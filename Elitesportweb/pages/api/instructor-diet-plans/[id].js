import dbConnect from '../../../lib/mongodb'
import DietPlan from '../../../models/DietPlan'
import Member from '../../../models/Member'
import mongoose from 'mongoose'

export default async function handler(req, res) {
  const { id } = req.query

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid instructor ID' })
  }

  await dbConnect()

  if (req.method === 'GET') {
    try {
      const dietPlans = await DietPlan.find({ instructorId: id })
        .populate('memberId', 'fullName email')
        .sort({ createdAt: -1 })

      res.status(200).json({ dietPlans })
    } catch (error) {
      console.error('Error fetching diet plans:', error)
      res.status(500).json({ error: 'Failed to fetch diet plans' })
    }
  } else if (req.method === 'POST') {
    try {
      const { memberId, title, description, meals, totalCalories, duration, goals, restrictions } = req.body

      const dietPlan = new DietPlan({
        memberId,
        instructorId: id,
        title,
        description,
        meals,
        totalCalories,
        duration,
        goals,
        restrictions
      })

      await dietPlan.save()
      await dietPlan.populate('memberId', 'fullName email')

      res.status(201).json({ dietPlan })
    } catch (error) {
      console.error('Error creating diet plan:', error)
      res.status(500).json({ error: 'Failed to create diet plan' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}