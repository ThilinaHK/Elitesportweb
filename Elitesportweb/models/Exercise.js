import mongoose from 'mongoose'

const ExerciseSchema = new mongoose.Schema({
  planName: { type: String, required: true },
  description: { type: String },
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  assignedBy: { type: String, required: true },
  exercises: [{
    name: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: String, required: true },
    weight: { type: String },
    duration: { type: String },
    instructions: { type: String }
  }],
  duration: { type: String },
  notes: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

export default mongoose.models.Exercise || mongoose.model('Exercise', ExerciseSchema)