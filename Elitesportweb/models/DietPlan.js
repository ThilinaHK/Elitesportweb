import mongoose from 'mongoose'

const DietPlanSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true },
  title: { type: String, required: true },
  description: { type: String },
  meals: [{
    name: { type: String, required: true },
    time: { type: String, required: true },
    foods: [{ type: String, required: true }],
    calories: { type: Number },
    notes: { type: String }
  }],
  totalCalories: { type: Number },
  duration: { type: String }, // e.g., "4 weeks"
  goals: [{ type: String }],
  restrictions: [{ type: String }],
  status: { type: String, default: 'active', enum: ['active', 'completed', 'paused'] },
  approvalStatus: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  approvedAt: { type: Date },
  rejectionReason: { type: String }
}, { timestamps: true })

export default mongoose.models.DietPlan || mongoose.model('DietPlan', DietPlanSchema)