import { sendPaymentEmail } from '../../lib/notifications'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const testPaymentData = {
      className: 'CrossFit Basic',
      amount: 50,
      paymentType: 'monthly',
      paymentDate: new Date()
    }

    const result = await sendPaymentEmail(
      'test@example.com', // Replace with your test email
      'Test User',
      testPaymentData
    )

    res.json({ 
      success: true, 
      message: 'Test email sent successfully',
      messageId: result.messageId 
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
}