import dbConnect from '../../../lib/mongodb';
import Member from '../../../models/Member';
import Payment from '../../../models/Payment';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const { qrData } = req.body;
    const data = JSON.parse(qrData);
    const currentMonth = new Date().toISOString().slice(0, 7);

    // Verify QR data is not expired (valid for 1 hour)
    const qrAge = Date.now() - data.timestamp;
    if (qrAge > 3600000) { // 1 hour
      return res.status(400).json({ 
        access: false, 
        message: 'QR code expired' 
      });
    }

    // Verify member exists
    const member = await Member.findById(data.memberId);
    if (!member) {
      return res.status(404).json({ 
        access: false, 
        message: 'Member not found' 
      });
    }

    // Check current payment status
    const payment = await Payment.findOne({
      memberId: data.memberId,
      paymentMonth: currentMonth,
      paymentType: { $in: ['monthly', 'sixMonthly', 'annually'] }
    });

    const hasAccess = !!payment;

    // Log access attempt
    console.log(`Access attempt: ${member.fullName || member.name} - ${hasAccess ? 'GRANTED' : 'DENIED'}`);

    res.status(200).json({
      access: hasAccess,
      memberName: member.fullName || member.name,
      message: hasAccess ? 'Access granted' : 'Payment required for access'
    });
  } catch (error) {
    console.error('Error verifying door access:', error);
    res.status(500).json({ 
      access: false, 
      message: 'Verification failed' 
    });
  }
}