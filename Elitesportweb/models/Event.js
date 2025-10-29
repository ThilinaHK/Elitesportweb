import mongoose from 'mongoose'

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true, enum: ['crossfit', 'karate', 'zumba', 'general', 'competition', 'workshop'] },
  maxParticipants: { type: Number, default: 50 },
  currentParticipants: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  image: { type: String },
  status: { type: String, default: 'active', enum: ['active', 'cancelled', 'completed'] },
  instructor: { type: String, required: true },
  requirements: [{ type: String }],
  forms: [{
    label: { type: String, required: true },
    type: { type: String, required: true, enum: ['text', 'email', 'tel', 'number', 'select', 'textarea'] },
    required: { type: Boolean, default: false },
    options: [{ type: String }]
  }],
  participants: [{
    memberName: String,
    phoneNumber: String,
    registrationDate: { type: Date, default: Date.now }
  }],
  isPublished: { type: Boolean, default: true }
}, { timestamps: true })

// Clear the model cache
delete mongoose.models.Event

export default mongoose.model('Event', EventSchema)