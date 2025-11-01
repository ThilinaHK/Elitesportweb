import dbConnect from '../../../lib/mongodb';
import Payment from '../../../models/Payment';
import cors from '../../../lib/cors';

export default async function handler(req, res) {
  cors(req, res);
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(200).json({ success: true, payments: [] });
  }

  try {
    const payments = await Payment.find({ memberId: id }).sort({ paymentDate: -1 });
    res.status(200).json({ success: true, payments: payments || [] });
  } catch (error) {
    console.error('Member payments fetch error:', error);
    res.status(200).json({ success: true, payments: [] });
  }
}