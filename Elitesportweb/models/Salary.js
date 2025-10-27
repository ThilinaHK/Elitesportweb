import mongoose from 'mongoose'

const SalarySchema = new mongoose.Schema({
  instructorId: { type: String, required: true },
  instructorName: { type: String, required: true },
  month: { type: String, required: true }, // YYYY-MM format
  baseSalary: { type: Number, required: true },
  bonuses: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentDate: { type: Date },
  status: { type: String, default: 'pending', enum: ['pending', 'paid'] },
  notes: { type: String }
})

if (mongoose.models.Salary) {
  delete mongoose.models.Salary
}

export default mongoose.model('Salary', SalarySchema)