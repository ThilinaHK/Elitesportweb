const mongoose = require('mongoose')
require('dotenv').config({ path: '.env.local' })

const InstructorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  specialization: { type: [String], required: true, enum: ['crossfit', 'karate', 'zumba'] },
  qualifications: [{ type: String, required: true }],
  experience: { type: Number, required: true },
  bio: { type: String },
  image: { type: String },
  status: { type: String, default: 'active', enum: ['active', 'inactive'] }
}, { timestamps: true })

const Instructor = mongoose.models.Instructor || mongoose.model('Instructor', InstructorSchema)

const sampleInstructors = [
  {
    name: "John Smith",
    email: "john.smith@elitesports.com",
    phone: "+94771234567",
    specialization: ["crossfit"],
    qualifications: ["CrossFit Level 2 Trainer", "Olympic Weightlifting Certification", "First Aid CPR Certified"],
    experience: 8,
    bio: "Experienced CrossFit trainer with expertise in Olympic weightlifting and functional fitness.",
    status: "active"
  },
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@elitesports.com",
    phone: "+94771234568",
    specialization: ["crossfit"],
    qualifications: ["CrossFit Level 3 Trainer", "Gymnastics Coach Certification", "Nutrition Specialist"],
    experience: 6,
    bio: "Specializes in strength training and gymnastics movements for CrossFit athletes.",
    status: "active"
  },
  {
    name: "Mike Wilson",
    email: "mike.wilson@elitesports.com",
    phone: "+94771234569",
    specialization: ["crossfit"],
    qualifications: ["CrossFit Level 2 Trainer", "Powerlifting Coach", "Sports Psychology Certificate"],
    experience: 5,
    bio: "Former competitive athlete turned coach, focusing on mental and physical strength.",
    status: "active"
  },
  {
    name: "Sensei Tanaka",
    email: "tanaka@elitesports.com",
    phone: "+94771234570",
    specialization: ["karate"],
    qualifications: ["6th Dan Black Belt Shotokan", "World Karate Federation Judge", "Traditional Weapons Master"],
    experience: 25,
    bio: "Master instructor with decades of experience in traditional Shotokan karate.",
    status: "active"
  },
  {
    name: "Sensei Maria",
    email: "maria@elitesports.com",
    phone: "+94771234571",
    specialization: ["karate"],
    qualifications: ["4th Dan Black Belt", "Youth Martial Arts Instructor", "Self-Defense Specialist"],
    experience: 12,
    bio: "Specializes in teaching karate to children and self-defense techniques.",
    status: "active"
  },
  {
    name: "Isabella Rodriguez",
    email: "isabella@elitesports.com",
    phone: "+94771234572",
    specialization: ["zumba"],
    qualifications: ["Zumba Instructor License", "Latin Dance Choreographer", "Group Fitness Certification"],
    experience: 7,
    bio: "Passionate Latin dance instructor bringing energy and joy to every Zumba class.",
    status: "active"
  },
  {
    name: "Carmen Lopez",
    email: "carmen@elitesports.com",
    phone: "+94771234573",
    specialization: ["zumba"],
    qualifications: ["Zumba Gold Specialist", "Senior Fitness Certification", "Dance Therapy Certificate"],
    experience: 10,
    bio: "Specializes in low-impact Zumba for seniors and therapeutic dance programs.",
    status: "active"
  }
]

async function seedInstructors() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')
    
    await Instructor.deleteMany({})
    console.log('Cleared existing instructors')
    
    await Instructor.insertMany(sampleInstructors)
    console.log('Sample instructors added successfully!')
    
    process.exit(0)
  } catch (error) {
    console.error('Error seeding instructors:', error)
    process.exit(1)
  }
}

seedInstructors()