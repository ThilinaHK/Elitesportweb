import mongoose from 'mongoose'

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
  thumbnail: { type: String },
  category: { type: String, required: true },
  instructor: { type: String },
  duration: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
})

if (mongoose.models.Video) {
  delete mongoose.models.Video
}

export default mongoose.model('Video', VideoSchema)