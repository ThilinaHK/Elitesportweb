import mongoose from 'mongoose'

const QuoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, required: true },
  position: { type: String },
  category: { type: String, required: true, enum: ['motivation', 'fitness', 'success', 'discipline'], default: 'motivation' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
})

if (mongoose.models.Quote) {
  delete mongoose.models.Quote
}

export default mongoose.model('Quote', QuoteSchema)