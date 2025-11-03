import dbConnect from '../../../lib/mongodb'
import ExercisePlan from '../../../models/ExercisePlan'
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
      const exercisePlans = await ExercisePlan.find({ instructorId: id })
        .populate('memberId', 'fullName email')
        .sort({ createdAt: -1 })

      res.status(200).json({ exercisePlans })
    } catch (error) {
      console.error('Error fetching exercise plans:', error)
      res.status(500).json({ error: 'Failed to fetch exercise plans' })
    }
  } else if (req.method === 'POST') {
    try {
      const { memberId, title, description, exercises, category, difficulty, duration, frequency, goals } = req.body

      const exercisePlan = new ExercisePlan({
        memberId,
        instructorId: id,
        title,
        description,
        exercises,
        category,
        difficulty,
        duration,
        frequency,
        goals
      })

      await exercisePlan.save()
      await exercisePlan.populate('memberId', 'fullName email')

      res.status(201).json({ exercisePlan })
    } catch (error) {
      console.error('Error creating exercise plan:', error)
      res.status(500).json({ error: 'Failed to create exercise plan' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}