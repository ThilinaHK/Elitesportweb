import dbConnect from '../../../lib/mongodb'
import Member from '../../../models/Member'
import Instructor from '../../../models/Instructor'
import Admin from '../../../models/Admin'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email, userType } = req.body

    if (!email || !userType) {
      return res.status(400).json({ success: false, message: 'Email and user type are required' })
    }

    try {
      await dbConnect()
      
      let user = null
      let credentials = null

      // Find user based on type
      switch (userType) {
        case 'member':
          user = await Member.findOne({ email })
          if (user) {
            credentials = {
              email: user.email,
              phone: user.phone,
              loginMethod: 'Use email and phone number to login'
            }
          }
          break
        case 'instructor':
          user = await Instructor.findOne({ email })
          if (user) {
            credentials = {
              email: user.email,
              phone: user.phone,
              loginMethod: 'Use email and phone number to login'
            }
          }
          break
        case 'admin':
          user = await Admin.findOne({ email })
          if (user) {
            credentials = {
              username: user.username,
              email: user.email,
              loginMethod: 'Use username: admin, password: elite123'
            }
          }
          break
        default:
          return res.status(400).json({ success: false, message: 'Invalid user type' })
      }

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found with this email' })
      }

      // Return credentials (in production, this should be sent via email)
      res.status(200).json({
        success: true,
        message: 'Credentials found',
        credentials,
        userType
      })

    } catch (dbError) {
      console.error('Database error:', dbError)
      
      // Fallback credentials
      const fallbackCredentials = {
        member: { loginMethod: 'Use your registered email and phone number' },
        instructor: { loginMethod: 'Use your registered email and phone number' },
        admin: { username: 'admin', loginMethod: 'Username: admin, Password: elite123' }
      }

      res.status(200).json({
        success: true,
        message: 'Using default credentials',
        credentials: fallbackCredentials[userType],
        userType
      })
    }

  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
