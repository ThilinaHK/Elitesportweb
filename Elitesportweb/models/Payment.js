import mongoose from 'mongoose'

const PaymentSchema = new mongoose.Schema({
  memberId: { type: String, required: true },
  memberName: { type: String, required: true },
  classId: { type: String, required: true },
  className: { type: String, required: true },
  paymentType: { type: String, required: true, enum: ['admission', 'monthly', 'sixMonthly', 'annually'] },
  amount: { type: Number, required: true },
  paymentMonth: { type: String, required: true }, // YYYY-MM format
  paymentDate: { type: Date, default: Date.now },
  status: { type: String, default: 'paid', enum: ['paid', 'pending', 'overdue'] },
  paymentMethod: { type: String, enum: ['cash', 'card', 'bank_transfer'] },
  notes: { type: String },
  verificationStatus: { type: String, default: 'unverified', enum: ['unverified', 'requested', 'verified', 'disputed'] },
  verificationRequestDate: { type: Date },
  verifiedBy: { type: String },
  verifiedDate: { type: Date }
})

if (mongoose.models.Payment) {
  delete mongoose.models.Payment
}

export default mongoose.model('Payment', PaymentSchema)