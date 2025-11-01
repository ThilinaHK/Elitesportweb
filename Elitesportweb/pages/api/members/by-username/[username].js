import dbConnect from '../../../../lib/mongodb';
import Member from '../../../../models/Member';

export default async function handler(req, res) {
  const { username } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    const member = await Member.findOne({ 
      username: username.toLowerCase().trim() 
    });
    
    if (!member) {
      return res.status(404).json({ success: false, error: 'Member not found' });
    }

    res.status(200).json({ success: true, member });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}