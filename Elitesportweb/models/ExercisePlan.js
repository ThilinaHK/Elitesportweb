import mongoose from 'mongoose'

const ExercisePlanSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true },
  title: { type: String, required: true },
  description: { type: String },
  exercises: [{
    name: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: String, required: true }, // e.g., "10-12" or "30 seconds"
    weight: { type: String }, // e.g., "20kg" or "bodyweight"
    restTime: { type: String }, // e.g., "60 seconds"
    notes: { type: String }
  }],
  category: { type: String, required: true, enum: ['crossfit', 'karate', 'zumba', 'general'] },
  difficulty: { type: String, required: true, enum: ['beginner', 'intermediate', 'advanced'] },
  duration: { type: String }, // e.g., "4 weeks"
  frequency: { type: String }, // e.g., "3 times per week"
  goals: [{ type: String }],
  status: { type: String, default: 'active', enum: ['active', 'completed', 'paused'] },
  approvalStatus: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  approvedAt: { type: Date },
  rejectionReason: { type: String }
}, { timestamps: true })

export default mongoose.models.ExercisePlan || mongoose.model('ExercisePlan', ExercisePlanSchema)