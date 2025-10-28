import connectDB from '../../../../lib/mongodb';
import Member from '../../../../models/Member';
import Payment from '../../../../models/Payment';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    const { id } = req.query;
    const currentMonth = new Date().toISOString().slice(0, 7);

    const member = await Member.findById(id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Check payment status for current month
    const payment = await Payment.findOne({
      memberId: id,
      paymentMonth: currentMonth,
      paymentType: { $in: ['monthly', 'sixMonthly', 'annually'] }
    });

    const hasAccess = !!payment;
    const qrData = {
      memberId: id,
      memberName: member.fullName || member.name,
      month: currentMonth,
      hasAccess,
      timestamp: Date.now()
    };

    res.status(200).json({
      qrData: JSON.stringify(qrData),
      hasAccess,
      member: {
        name: member.fullName || member.name,
        email: member.email
      }
    });
  } catch (error) {
    console.error('Error generating QR access:', error);
    res.status(500).json({ message: 'Server error' });
  }
}