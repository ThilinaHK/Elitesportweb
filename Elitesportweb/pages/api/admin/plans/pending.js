import dbConnect from '../../../../lib/mongodb'
import DietPlan from '../../../../models/DietPlan'
import ExercisePlan from '../../../../models/ExercisePlan'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  await dbConnect()

  try {
    const [pendingDietPlans, pendingExercisePlans] = await Promise.all([
      DietPlan.find({ approvalStatus: 'pending' })
        .populate('memberId', 'fullName email')
        .populate('instructorId', 'name')
        .sort({ createdAt: -1 }),
      ExercisePlan.find({ approvalStatus: 'pending' })
        .populate('memberId', 'fullName email')
        .populate('instructorId', 'name')
        .sort({ createdAt: -1 })
    ])

    res.status(200).json({ dietPlans: pendingDietPlans, exercisePlans: pendingExercisePlans })
  } catch (error) {
    console.error('Error fetching pending plans:', error)
    res.status(500).json({ error: 'Failed to fetch pending plans' })
  }
}
