import dbConnect from '../../../lib/mongodb'
import Instructor from '../../../models/Instructor'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await dbConnect()
    
    // Find all instructors without instructorId
    const instructorsWithoutId = await Instructor.find({ 
      $or: [
        { instructorId: { $exists: false } },
        { instructorId: null },
        { instructorId: '' }
      ]
    }).sort({ createdAt: 1 })

    if (instructorsWithoutId.length === 0) {
      return res.json({ message: 'All instructors already have registration numbers', updated: 0 })
    }

    // Find the highest existing instructor ID number
    const instructorsWithId = await Instructor.find({ 
      instructorId: { $exists: true, $ne: null, $ne: '' }
    }).sort({ instructorId: -1 })

    let nextNumber = 1
    if (instructorsWithId.length > 0) {
      const lastId = instructorsWithId[0].instructorId
      if (lastId && lastId.startsWith('EL00')) {
        const lastNumber = parseInt(lastId.replace('EL00', ''))
        nextNumber = lastNumber + 1
      }
    }

    // Update instructors without IDs
    const updatePromises = instructorsWithoutId.map(async (instructor, index) => {
      const instructorId = `EL00${(nextNumber + index).toString().padStart(3, '0')}`
      return Instructor.findByIdAndUpdate(
        instructor._id,
        { instructorId },
        { new: true }
      )
    })

    await Promise.all(updatePromises)

    res.json({ 
      message: `Successfully assigned registration numbers to ${instructorsWithoutId.length} instructors`,
      updated: instructorsWithoutId.length,
      startingNumber: nextNumber
    })

  } catch (error) {
    console.error('Migration error:', error)
    res.status(500).json({ error: error.message })
  }
}