import mongoose from 'mongoose'

const SalaryHistorySchema = new mongoose.Schema({
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true },
  month: { type: String, required: true }, // e.g., "2024-01"
  baseSalary: { type: Number, required: true },
  bonuses: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  totalSalary: { type: Number, required: true },
  paymentDate: { type: Date },
  status: { type: String, default: 'pending', enum: ['pending', 'paid', 'cancelled'] },
  notes: { type: String }
}, { timestamps: true })

// Compound index to ensure one record per instructor per month
SalaryHistorySchema.index({ instructorId: 1, month: 1 }, { unique: true })

export default mongoose.models.SalaryHistory || mongoose.model('SalaryHistory', SalaryHistorySchema)