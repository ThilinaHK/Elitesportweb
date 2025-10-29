import mongoose from 'mongoose'

const DietSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  memberName: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  className: { type: String },
  planName: { type: String, required: true },
  description: { type: String, required: true },
  meals: [{
    name: String,
    time: String,
    foods: [String]
  }],
  calories: Number,
  duration: String,
  notes: String,
  status: { type: String, default: 'active', enum: ['active', 'completed', 'paused'] },
  assignedBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.models.Diet || mongoose.model('Diet', DietSchema)