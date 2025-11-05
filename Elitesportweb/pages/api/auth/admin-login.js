import dbConnect from '../../../lib/mongodb'
import Admin from '../../../models/Admin'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;
    
    // Try MongoDB first
    try {
      await dbConnect()
      
      // Check if admin exists, if not create default admin
      let admin = await Admin.findOne({ username: 'admin' })
      if (!admin) {
        const hashedPassword = await bcrypt.hash('elite123', 10)
        admin = await Admin.create({
          username: 'admin',
          password: hashedPassword,
          email: 'admin@elitesports.com',
          role: 'super_admin'
        })
        console.log('Default admin created:', admin.username)
      }
      
      // Verify credentials
      const foundAdmin = await Admin.findOne({ username })
      if (foundAdmin && await bcrypt.compare(password, foundAdmin.password)) {
        const token = 'admin-' + Date.now()
        return res.status(200).json({ success: true, token, admin: { username: foundAdmin.username, email: foundAdmin.email } })
      }
    } catch (dbError) {
      console.error('Database error, using fallback:', dbError)
    }
    
    // Fallback to hardcoded credentials
    if (username === 'admin' && password === 'elite123') {
      const token = 'admin-' + Date.now()
      return res.status(200).json({ success: true, token, admin: { username: 'admin', email: 'admin@elitesports.com' } })
    }
    
    res.status(401).json({ success: false, message: 'Invalid credentials' })
  } catch (error) {
    console.error('Admin login error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
