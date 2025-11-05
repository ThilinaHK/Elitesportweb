import mongoose from 'mongoose'

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, enum: ['general', 'crossfit', 'karate', 'zumba', 'competition', 'workshop'], default: 'general' },
  maxParticipants: { type: Number, default: 50 },
  currentParticipants: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  instructor: { type: String, required: true },
  requirements: [String],
  image: String,
  status: { type: String, enum: ['active', 'cancelled', 'completed'], default: 'active' },
  forms: [{
    label: String,
    type: { type: String, enum: ['text', 'email', 'tel', 'number', 'select', 'textarea'] },
    required: Boolean,
    options: [String]
  }],
  participants: [{
    memberName: String,
    phoneNumber: String,
    isMember: String,
    registrationDate: { type: Date, default: Date.now },
    formData: mongoose.Schema.Types.Mixed
  }]
}, {
  timestamps: true
})

export default mongoose.models.Event || mongoose.model('Event', EventSchema)