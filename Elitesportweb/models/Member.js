import mongoose from 'mongoose'

const MemberSchema = new mongoose.Schema({
  memberId: { 
    type: String, 
    unique: true, 
    default: () => 'ESA' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 100).toString().padStart(2, '0')
  },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  nic: { type: String, required: true },
  address: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true, enum: ['male', 'female'] },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  emergencyContact: { type: String, required: true },
  medicalConditions: { type: String },
  profilePicture: { type: String },
  membershipType: { type: String, required: true },
  assignedClasses: [{ type: String }],
  joinDate: { type: Date, default: Date.now },
  status: { type: String, default: 'active' }
})

// Clear any existing model to avoid conflicts
if (mongoose.models.Member) {
  delete mongoose.models.Member
}

export default mongoose.model('Member', MemberSchema)