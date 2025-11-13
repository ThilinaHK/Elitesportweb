import dbConnect from '../../../lib/mongodb';
import DietPlan from '../../../models/DietPlan';
import Member from '../../../models/Member';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const member = await Member.findById(id) || await Member.findOne({ memberId: id });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const diets = await DietPlan.find({ memberId: member._id });
    res.json({ diets });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}