import dbConnect from '../../lib/mongodb';
import Member from '../../models/Member';
import Class from '../../models/Class';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Create a test member
    const testMember = await Member.findOneAndUpdate(
      { email: 'test@example.com' },
      {
        fullName: 'Test Member',
        email: 'test@example.com',
        phone: '0771234567',
        memberId: 'TEST001',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'male',
        address: 'Test Address',
        emergencyContact: '0779876543',
        joinDate: new Date(),
        membershipType: 'monthly',
        assignedClasses: []
      },
      { upsert: true, new: true }
    );

    // Create a test class
    const testClass = await Class.findOneAndUpdate(
      { name: 'Test CrossFit' },
      {
        name: 'Test CrossFit',
        type: 'CrossFit',
        instructor: 'Test Instructor',
        time: '08:00 AM',
        duration: '1 hour',
        maxCapacity: 20,
        currentCapacity: 5
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Test data created successfully',
      testMember: {
        id: testMember._id,
        email: testMember.email,
        phone: testMember.phone
      },
      testClass: {
        id: testClass._id,
        name: testClass.name
      }
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create test data',
      error: error.message
    });
  }
}
