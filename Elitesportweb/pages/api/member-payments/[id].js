import dbConnect from '../../../lib/mongodb';
import Payment from '../../../models/Payment';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const payments = await Payment.find({ memberId: id }).sort({ paymentDate: -1 });
    res.status(200).json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}