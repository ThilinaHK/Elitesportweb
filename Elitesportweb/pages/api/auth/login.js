import dbConnect from '../../../lib/mongodb';
import Member from '../../../models/Member';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { email, phone } = req.body;
    
    const member = await Member.findOne({
      $and: [
        { email: email },
        { phone: phone }
      ]
    });

    if (!member) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({ success: true, member });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}