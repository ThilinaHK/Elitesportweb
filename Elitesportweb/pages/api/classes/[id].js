import dbConnect from '../../../lib/mongodb'
import Class from '../../../models/Class'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  const { id } = req.query
  
  try {
    await dbConnect()
  } catch (error) {
    console.error('Database connection failed:', error)
    return res.status(500).json({ error: 'Database connection failed' })
  }

  if (req.method === 'DELETE') {
    try {
      const deletedClass = await Class.findByIdAndDelete(id)
      if (!deletedClass) {
        return res.status(404).json({ error: 'Class not found' })
      }
      res.status(200).json({ message: 'Class deleted successfully' })
    } catch (error) {
      console.error('Delete error:', error)
      res.status(400).json({ error: error.message })
    }
  } else if (req.method === 'PUT') {
    try {
      const updateData = { ...req.body }
      
      // Convert numeric fields
      if (updateData.duration) updateData.duration = Number(updateData.duration)
      if (updateData.capacity) updateData.capacity = Number(updateData.capacity)
      if (updateData.admissionFee) updateData.admissionFee = Number(updateData.admissionFee)
      
      let updatedClass = await Class.findByIdAndUpdate(id, updateData, { 
        new: true, 
        runValidators: true 
      }).catch(() => null)
      if (!updatedClass) {
        updatedClass = await Class.findOneAndUpdate({ classId: id }, updateData, { 
          new: true, 
          runValidators: true 
        })
      }
      if (!updatedClass) {
        return res.status(404).json({ error: 'Class not found' })
      }
      res.status(200).json(updatedClass)
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