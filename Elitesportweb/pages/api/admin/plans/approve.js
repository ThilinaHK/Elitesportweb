import dbConnect from '../../../../lib/mongodb'
import DietPlan from '../../../../models/DietPlan'
import ExercisePlan from '../../../../models/ExercisePlan'
import mongoose from 'mongoose'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { planId, planType, action, rejectionReason } = req.body

  if (!mongoose.Types.ObjectId.isValid(planId)) {
    return res.status(400).json({ error: 'Invalid plan ID' })
  }

  await dbConnect()

  try {
    const Model = planType === 'diet' ? DietPlan : ExercisePlan
    const updateData = {
      approvalStatus: action,
      approvedAt: new Date()
    }

    if (action === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason
    }

    const plan = await Model.findByIdAndUpdate(planId, updateData, { new: true })
      .populate('memberId', 'fullName email')
      .populate('instructorId', 'name')

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' })
    }

    res.status(200).json({ plan })
  } catch (error) {
    console.error('Error updating plan approval:', error)
    res.status(500).json({ error: 'Failed to update plan approval' })
  }
}