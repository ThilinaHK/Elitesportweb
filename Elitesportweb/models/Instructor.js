import mongoose from 'mongoose'

const InstructorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  specialization: { type: [String], required: true, enum: ['crossfit', 'karate', 'zumba'] },
  qualifications: [{ type: String, required: true }],
  experience: { type: Number, required: true }, // years
  position: { type: String, required: true, default: 'instructor', enum: ['instructor', 'senior_instructor', 'chief_instructor', 'head_trainer', 'ceo'] },
  salary: { type: Number, required: true, default: 50000 },
  bio: { type: String },
  image: { type: String },
  status: { type: String, default: 'active', enum: ['active', 'inactive'] },
  privileges: {
    canManageClasses: { type: Boolean, default: false },
    canViewReports: { type: Boolean, default: false },
    canManageMembers: { type: Boolean, default: false },
    canViewPayments: { type: Boolean, default: false }
  }
}, { timestamps: true })

export default mongoose.models.Instructor || mongoose.model('Instructor', InstructorSchema)