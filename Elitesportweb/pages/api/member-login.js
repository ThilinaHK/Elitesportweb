import dbConnect from '../../lib/mongodb';
import Member from '../../models/Member';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { memberId } = req.body;

  if (!memberId) {
    return res.status(400).json({ error: 'Member ID is required' });
  }

  try {
    await dbConnect();
    
    const member = await Member.findOne({ memberId: memberId.trim() });
    
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.setHeader('Set-Cookie', `memberId=${member.memberId}; Path=/; HttpOnly; Max-Age=86400`);
    res.status(200).json({
      success: true,
      member: {
        _id: member._id,
        memberId: member.memberId,
        fullName: member.fullName,
        email: member.email,
        phone: member.phone
      }
    });
  } catch (error) {
    console.error('Member login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}
