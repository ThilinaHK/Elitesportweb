import dbConnect from '../../lib/mongodb';
import Member from '../../models/Member';

export default async function handler(req, res) {
  try {
    await dbConnect();
    
    // Check if member exists
    const member = await Member.findOne({ email: 'thilina2u@gmail.com' });
    
    if (!member) {
      // Create test member
      const testMember = await Member.create({
        fullName: 'Thilina Test',
        email: 'thilina2u@gmail.com',
        phone: '0716800490',
        nic: '123456789V',
        address: 'Test Address',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'male',
        weight: 70,
        height: 175,
        emergencyContact: '0771234567',
        membershipType: 'monthly'
      });
      
      return res.json({ 
        success: true, 
        message: 'Test member created',
        member: testMember 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Member exists',
      member: {
        email: member.email,
        phone: member.phone,
        fullName: member.fullName
      }
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
}