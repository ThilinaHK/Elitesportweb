import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  youtubeUrl: { type: String },
  videoId: { type: String }, // extracted from URL
  category: { type: String, required: true, enum: ['crossfit', 'karate', 'zumba', 'general', 'fitness', 'nutrition', 'health', 'lifestyle'] },
  type: { type: String, required: true, enum: ['normal', 'trending', 'featured', 'article'], default: 'normal' },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor' },
  instructorName: { type: String },
  isActive: { type: Boolean, default: true },
  // Article-specific fields
  content: { type: String }, // Full article content
  excerpt: { type: String }, // Brief description for articles
  featuredImage: { type: String }, // Base64 or URL for article image
  tags: [{ type: String }], // Array of tags
  isPublished: { type: Boolean, default: true }, // For draft/published status
  createdAt: { type: Date, default: Date.now }
})

if (mongoose.models.Post) {
  delete mongoose.models.Post
}

export default mongoose.model('Post', PostSchema)