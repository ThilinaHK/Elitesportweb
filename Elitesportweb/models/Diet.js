import mongoose from 'mongoose'

const DietSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  memberName: { type: String, required: true },
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
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Diet || mongoose.model('Diet', DietSchema)