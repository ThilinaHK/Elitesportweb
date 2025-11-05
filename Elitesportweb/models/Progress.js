import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  memberName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  weight: { type: Number },
  bodyFat: { type: Number },
  muscleMass: { type: Number },
  measurements: {
    chest: { type: Number },
    waist: { type: Number },
    hips: { type: Number },
    arms: { type: Number },
    thighs: { type: Number }
  },
  goals: { type: String },
  achievements: { type: String },
  notes: { type: String },
  photos: [{ type: String }]
}, {
  timestamps: true
});

export default mongoose.models.Progress || mongoose.model('Progress', progressSchema);