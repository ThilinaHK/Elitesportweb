import mongoose from 'mongoose'

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['crossfit', 'karate', 'zumba'] },
  instructor: { type: String, required: true },
  day: { type: String, required: true, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
  time: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  capacity: { type: Number, required: true },
  description: { type: String },
  isOnline: { type: Boolean, default: false },
  meetingLink: { type: String },
  admissionFee: { type: Number, required: true, default: 0 },
  fees: {
    monthly: { type: Number, required: true, default: 0 },
    sixMonthly: { type: Number, required: true, default: 0 },
    annually: { type: Number, required: true, default: 0 }
  },
  status: { type: String, default: 'active', enum: ['active', 'cancelled'] }
}, { timestamps: true })

export default mongoose.models.Class || mongoose.model('Class', ClassSchema)