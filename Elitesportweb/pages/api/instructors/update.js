import dbConnect from '../../../lib/mongodb'
import Instructor from '../../../models/Instructor'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  if (req.method === 'POST') {
    try {
      await dbConnect()
      const { id, ...updateData } = req.body
      if (!id) {
        return res.status(400).json({ error: 'Instructor ID is required' })
      }
      
      if (updateData.image && updateData.image.length > 1000000) {
        console.log('Large image detected, processing...')
      }
      
      let instructor = await Instructor.findByIdAndUpdate(id, updateData, { 
        new: true,
        runValidators: true 
      }).catch(() => null)
      
      if (!instructor) {
        instructor = await Instructor.findOneAndUpdate({ instructorId: id }, updateData, { 
          new: true,
          runValidators: true 
        })
      }
      
      if (!instructor) {
        return res.status(404).json({ error: 'Instructor not found' })
      }
      
      res.status(200).json(instructor)
    } catch (error) {
      console.error('Update error:', error)
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: 'Validation failed', details: error.message })
      }
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Duplicate key error', details: error.message })
      }
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
