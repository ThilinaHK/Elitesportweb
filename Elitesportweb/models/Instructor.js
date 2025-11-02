import mongoose from 'mongoose'

const InstructorSchema = new mongoose.Schema({
  instructorId: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  specialization: { type: [String], required: true, enum: ['crossfit', 'karate', 'zumba'] },
  qualifications: [{ type: String, required: true }],
  experience: { type: Number, required: true }, // years
  position: { type: String, required: true, default: 'instructor', enum: ['instructor', 'senior_instructor', 'chief_instructor', 'head_trainer', 'manager', 'admin', 'ceo'] },
  salary: { type: Number, required: true, default: 50000 },
  bio: { type: String },
  image: { type: String },
  assignedClasses: [{ type: String }], // Array of class IDs
  status: { type: String, default: 'active', enum: ['active', 'inactive'] },
  privileges: {
    // Class Management
    canManageClasses: { type: Boolean, default: false },
    canCreateClasses: { type: Boolean, default: false },
    canDeleteClasses: { type: Boolean, default: false },
    canViewClassSchedule: { type: Boolean, default: true },
    canManageBookings: { type: Boolean, default: false },
    
    // Member Management
    canManageMembers: { type: Boolean, default: false },
    canViewMembers: { type: Boolean, default: false },
    canEditMembers: { type: Boolean, default: false },
    canDeleteMembers: { type: Boolean, default: false },
    canViewMemberProgress: { type: Boolean, default: false },
    
    // Financial
    canViewPayments: { type: Boolean, default: false },
    canManagePayments: { type: Boolean, default: false },
    canViewRevenue: { type: Boolean, default: false },
    canGenerateInvoices: { type: Boolean, default: false },
    
    // Reports & Analytics
    canViewReports: { type: Boolean, default: false },
    canViewAnalytics: { type: Boolean, default: false },
    canExportData: { type: Boolean, default: false },
    canViewAttendance: { type: Boolean, default: false },
    
    // System Administration
    canManageInstructors: { type: Boolean, default: false },
    canManageSettings: { type: Boolean, default: false },
    canViewLogs: { type: Boolean, default: false },
    canBackupData: { type: Boolean, default: false }
  }
}, { timestamps: true })

export default mongoose.models.Instructor || mongoose.model('Instructor', InstructorSchema)