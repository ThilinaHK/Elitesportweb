import dbConnect from '../../lib/mongodb'
import Settings from '../../models/Settings'

export default async function handler(req, res) {
  await dbConnect()

  if (req.method === 'GET') {
    try {
      const smsConfig = await Settings.findOne({ category: 'sms_gateway' })
      res.status(200).json(smsConfig?.config || {})
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch SMS configuration' })
    }
  } else if (req.method === 'POST') {
    try {
      const { provider, config } = req.body
      
      const smsConfig = await Settings.findOneAndUpdate(
        { category: 'sms_gateway' },
        { 
          category: 'sms_gateway',
          config: {
            provider,
            ...config,
            updatedAt: new Date()
          }
        },
        { upsert: true, new: true }
      )
      
      res.status(200).json({ message: 'SMS configuration saved successfully', config: smsConfig })
    } catch (error) {
      res.status(500).json({ error: 'Failed to save SMS configuration' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
