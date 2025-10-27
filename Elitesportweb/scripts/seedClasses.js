const mongoose = require('mongoose')
require('dotenv').config({ path: '.env.local' })

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['crossfit', 'karate', 'zumba'] },
  instructor: { type: String, required: true },
  day: { type: String, required: true, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
  time: { type: String, required: true },
  duration: { type: Number, required: true },
  capacity: { type: Number, required: true },
  description: { type: String },
  isOnline: { type: Boolean, default: false },
  meetingLink: { type: String },
  status: { type: String, default: 'active', enum: ['active', 'cancelled'] }
}, { timestamps: true })

const Class = mongoose.models.Class || mongoose.model('Class', ClassSchema)

const sampleClasses = [
  {
    name: "Morning CrossFit Blast",
    category: "crossfit",
    instructor: "John Smith",
    day: "Monday",
    time: "06:00",
    duration: 60,
    capacity: 15,
    description: "High-intensity morning workout to start your week strong",
    isOnline: false
  },
  {
    name: "CrossFit Strength Training",
    category: "crossfit",
    instructor: "Sarah Johnson",
    day: "Wednesday",
    time: "18:00",
    duration: 75,
    capacity: 12,
    description: "Focus on Olympic lifts and strength building",
    isOnline: false
  },
  {
    name: "Weekend CrossFit Challenge",
    category: "crossfit",
    instructor: "Mike Wilson",
    day: "Saturday",
    time: "09:00",
    duration: 90,
    capacity: 20,
    description: "Challenging weekend workout for all fitness levels",
    isOnline: false
  },
  {
    name: "Traditional Karate",
    category: "karate",
    instructor: "Sensei Tanaka",
    day: "Tuesday",
    time: "17:00",
    duration: 60,
    capacity: 25,
    description: "Learn traditional karate forms and techniques",
    isOnline: false
  },
  {
    name: "Kids Karate Class",
    category: "karate",
    instructor: "Sensei Maria",
    day: "Thursday",
    time: "16:00",
    duration: 45,
    capacity: 15,
    description: "Karate training designed specifically for children",
    isOnline: false
  },
  {
    name: "Advanced Karate Sparring",
    category: "karate",
    instructor: "Sensei Tanaka",
    day: "Saturday",
    time: "14:00",
    duration: 90,
    capacity: 12,
    description: "Advanced sparring techniques for experienced students",
    isOnline: false
  },
  {
    name: "Zumba Dance Fitness",
    category: "zumba",
    instructor: "Isabella Rodriguez",
    day: "Monday",
    time: "19:00",
    duration: 50,
    capacity: 30,
    description: "High-energy Latin dance fitness class",
    isOnline: false
  },
  {
    name: "Zumba Gold (Seniors)",
    category: "zumba",
    instructor: "Carmen Lopez",
    day: "Wednesday",
    time: "10:00",
    duration: 45,
    capacity: 20,
    description: "Low-impact Zumba designed for active older adults",
    isOnline: false
  },
  {
    name: "Virtual Zumba Party",
    category: "zumba",
    instructor: "Isabella Rodriguez",
    day: "Friday",
    time: "20:00",
    duration: 60,
    capacity: 50,
    description: "Online Zumba party - dance from home!",
    isOnline: true,
    meetingLink: "https://zoom.us/j/123456789"
  },
  {
    name: "Sunday Zumba Flow",
    category: "zumba",
    instructor: "Carmen Lopez",
    day: "Sunday",
    time: "11:00",
    duration: 55,
    capacity: 25,
    description: "Relaxing Sunday Zumba with slower rhythms",
    isOnline: false
  }
]

async function seedClasses() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')
    
    await Class.deleteMany({})
    console.log('Cleared existing classes')
    
    await Class.insertMany(sampleClasses)
    console.log('Sample classes added successfully!')
    
    process.exit(0)
  } catch (error) {
    console.error('Error seeding classes:', error)
    process.exit(1)
  }
}

seedClasses()