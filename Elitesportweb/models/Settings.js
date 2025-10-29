import mongoose from 'mongoose'

const SettingsSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true
  },
  config: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: true
})

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema)