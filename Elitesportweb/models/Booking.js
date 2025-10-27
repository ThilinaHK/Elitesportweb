import mongoose from 'mongoose'

const BookingSchema = new mongoose.Schema({
  memberName: { type: String, required: true },
  memberEmail: { type: String, required: true },
  memberPhone: { type: String, required: true },
  classId: { type: String, required: true },
  className: { type: String, required: true },
  classTime: { type: String, required: true },
  classDay: { type: String, required: true },
  bookingDate: { type: Date, default: Date.now },
  status: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'cancelled'] }
})

if (mongoose.models.Booking) {
  delete mongoose.models.Booking
}

export default mongoose.model('Booking', BookingSchema)