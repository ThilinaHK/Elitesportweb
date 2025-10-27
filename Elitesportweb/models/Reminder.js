import mongoose from 'mongoose'

const ReminderSchema = new mongoose.Schema({
  memberId: { type: String, required: true },
  memberName: { type: String, required: true },
  classId: { type: String, required: true },
  className: { type: String, required: true },
  dueMonth: { type: String, required: true }, // YYYY-MM format
  amount: { type: Number, required: true },
  reminderDate: { type: Date, default: Date.now },
  status: { type: String, default: 'pending', enum: ['pending', 'paid'] },
  reminderCount: { type: Number, default: 1 }
})

if (mongoose.models.Reminder) {
  delete mongoose.models.Reminder
}

export default mongoose.model('Reminder', ReminderSchema)