import mongoose from 'mongoose'

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  excerpt: { type: String },
  readTime: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
})

if (mongoose.models.Article) {
  delete mongoose.models.Article
}

export default mongoose.model('Article', ArticleSchema)