import dbConnect from '../../lib/mongodb'
import Settings from '../../models/Settings'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  await dbConnect()

  try {
    const { phone, message } = req.body
    
    // Get SMS configuration
    const smsSettings = await Settings.findOne({ category: 'sms_gateway' })
    
    if (!smsSettings || !smsSettings.config) {
      return res.status(400).json({ error: 'SMS gateway not configured' })
    }

    const config = smsSettings.config

    // Try Twilio first if configured
    if (config.twilio && config.twilio.accountSid && config.twilio.authToken) {
      try {
        const twilio = require('twilio')(config.twilio.accountSid, config.twilio.authToken)
        
        await twilio.messages.create({
          body: message,
          from: config.twilio.fromNumber,
          to: phone
        })
        
        return res.status(200).json({ message: 'Test SMS sent successfully via Twilio' })
      } catch (twilioError) {
        console.error('Twilio error:', twilioError)
        // Fall through to try local gateway
      }
    }

    // Try local SMS gateway if Twilio fails or not configured
    if (config.local && config.local.apiUrl && config.local.apiKey) {
      try {
        const response = await fetch(config.local.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.local.apiKey}`
          },
          body: JSON.stringify({
            to: phone,
            message: message,
            sender_id: config.local.senderId || 'ELITE_GYM'
          })
        })

        if (response.ok) {
          return res.status(200).json({ message: 'Test SMS sent successfully via Local Gateway' })
        } else {
          throw new Error('Local SMS API failed')
        }
      } catch (localError) {
        console.error('Local SMS error:', localError)
      }
    }

    res.status(500).json({ error: 'Failed to send SMS. Please check your configuration.' })
  } catch (error) {
    console.error('Test SMS error:', error)
    res.status(500).json({ error: 'Failed to send test SMS' })
  }
}