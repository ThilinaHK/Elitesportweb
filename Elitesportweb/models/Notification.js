import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  className: { type: String, required: true },
  type: { type: String, enum: ['general', 'important', 'urgent'], default: 'general' },
  scheduledDate: { type: Date },
  scheduledTime: { type: String },
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  isSent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);