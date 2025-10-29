import nodemailer from 'nodemailer'
import dbConnect from './mongodb'
import Settings from '../models/Settings'

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Get SMS configuration from database
const getSmsConfig = async () => {
  await dbConnect()
  const smsSettings = await Settings.findOne({ category: 'sms_gateway' })
  return smsSettings?.config || null
}

export const sendPaymentEmail = async (memberEmail, memberName, paymentData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: memberEmail,
    subject: 'Payment Confirmation - Elite Sports Academy',
    html: `
      <h2>Payment Confirmation</h2>
      <p>Dear ${memberName},</p>
      <p>Your payment has been successfully processed:</p>
      <ul>
        <li>Class: ${paymentData.className}</li>
        <li>Amount: $${paymentData.amount}</li>
        <li>Payment Type: ${paymentData.paymentType}</li>
        <li>Date: ${new Date(paymentData.paymentDate).toLocaleDateString()}</li>
      </ul>
      <p>Thank you for choosing Elite Sports Academy!</p>
    `
  }
  
  return await transporter.sendMail(mailOptions)
}

export const sendPaymentSMS = async (memberPhone, memberName, paymentData) => {
  const config = await getSmsConfig()
  if (!config) throw new Error('SMS gateway not configured')
  
  const message = `Hi ${memberName}, your payment of LKR ${paymentData.amount} for ${paymentData.className} has been confirmed. Thank you! - Elite Sports Academy`
  
  return await sendSMS(memberPhone, message, config)
}

export const sendOverdueEmail = async (memberEmail, memberName, paymentData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: memberEmail,
    subject: 'Payment Overdue - Elite Sports Academy',
    html: `
      <h2>Payment Overdue Notice</h2>
      <p>Dear ${memberName},</p>
      <p>Your payment is overdue:</p>
      <ul>
        <li>Class: ${paymentData.className}</li>
        <li>Amount: $${paymentData.amount}</li>
        <li>Due Month: ${paymentData.paymentMonth}</li>
      </ul>
      <p>Please make payment as soon as possible to avoid service interruption.</p>
    `
  }
  
  return await transporter.sendMail(mailOptions)
}

export const sendOverdueSMS = async (memberPhone, memberName, paymentData) => {
  const config = await getSmsConfig()
  if (!config) throw new Error('SMS gateway not configured')
  
  const template = config.templates?.paymentReminder || 'Hi {memberName}, your payment of LKR {amount} for {className} is overdue. Please pay soon. - Elite Sports Academy'
  const message = template
    .replace('{memberName}', memberName)
    .replace('{amount}', paymentData.amount)
    .replace('{className}', paymentData.className)
    .replace('{month}', paymentData.paymentMonth)
  
  return await sendSMS(memberPhone, message, config)
}

// Generic SMS sending function
const sendSMS = async (phone, message, config) => {
  // Try Twilio first if configured
  if (config.twilio && config.twilio.accountSid && config.twilio.authToken) {
    try {
      const twilio = require('twilio')(config.twilio.accountSid, config.twilio.authToken)
      return await twilio.messages.create({
        body: message,
        from: config.twilio.fromNumber,
        to: phone
      })
    } catch (error) {
      console.error('Twilio SMS failed:', error)
      // Fall through to local gateway
    }
  }
  
  // Try local SMS gateway
  if (config.local && config.local.apiUrl && config.local.apiKey) {
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
    
    if (!response.ok) {
      throw new Error('Local SMS gateway failed')
    }
    
    return await response.json()
  }
  
  throw new Error('No SMS gateway configured')
}