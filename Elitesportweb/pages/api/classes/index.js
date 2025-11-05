import dbConnect from '../../../lib/mongodb'
import Class from '../../../models/Class'
import { fallbackClasses } from '../../../lib/fallbackData'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await dbConnect()
      const classes = await Class.find({}).sort({ createdAt: -1 })
      res.json(classes || [])
    } catch (error) {
      console.error('Classes API error:', error)
      res.json(fallbackClasses)
    }
  } else if (req.method === 'POST') {
    try {
      await dbConnect()
      
      const classData = { ...req.body }
      
      // Convert numeric fields
      if (classData.duration) classData.duration = Number(classData.duration)
      if (classData.capacity) classData.capacity = Number(classData.capacity)
      if (classData.admissionFee) classData.admissionFee = Number(classData.admissionFee)
      
      const newClass = await Class.create(classData)
      res.status(201).json(newClass)
    } catch (error) {
      console.error('Class creation error:', error)
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: 'Validation failed', details: error.message })
      }
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Duplicate key error', details: error.message })
      }
      res.status(500).json({ error: error.message })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}