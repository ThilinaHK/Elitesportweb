import dbConnect from '../../../lib/mongodb'
import Diet from '../../../models/Diet'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect()
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(200).json({ success: true, diets: [] });
  }

  try {
    const diets = await Diet.find({ memberId: id }).sort({ createdAt: -1 })
    res.status(200).json({ success: true, diets: diets || [] })
  } catch (error) {
    console.error('Member diet fetch error:', error);
    res.status(200).json({ success: true, diets: [] })
  }
}