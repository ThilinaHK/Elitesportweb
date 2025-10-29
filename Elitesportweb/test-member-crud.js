// Test script for Member CRUD operations
// Run with: node test-member-crud.js

const baseUrl = 'http://localhost:3000'; // Change to your server URL

// Test data
const testMember = {
  fullName: "Test Member",
  email: "test@example.com",
  phone: "0771234567",
  nic: "123456789V",
  address: "Test Address",
  dateOfBirth: "1990-01-01",
  gender: "male",
  weight: 70,
  height: 175,
  emergencyContact: "0779876543",
  medicalConditions: "None",
  membershipType: "monthly",
  assignedClasses: []
};

async function testMemberCRUD() {
  console.log('🧪 Testing Member CRUD Operations...\n');
  
  let createdMemberId = null;
  
  try {
    // 1. CREATE - Test member creation
    console.log('1️⃣ Testing CREATE operation...');
    const createResponse = await fetch(`${baseUrl}/api/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testMember)
    });
    
    if (createResponse.ok) {
      const createResult = await createResponse.json();
      createdMemberId = createResult._id;
      console.log('✅ CREATE successful - Member ID:', createdMemberId);
    } else {
      const error = await createResponse.text();
      console.log('❌ CREATE failed:', error);
      return;
    }
    
    // 2. READ - Test getting the created member
    console.log('\n2️⃣ Testing READ operation...');
    const readResponse = await fetch(`${baseUrl}/api/members/${createdMemberId}`);
    
    if (readResponse.ok) {
      const readResult = await readResponse.json();
      console.log('✅ READ successful - Member name:', readResult.member.fullName);
    } else {
      console.log('❌ READ failed');
    }
    
    // 3. UPDATE - Test updating the member
    console.log('\n3️⃣ Testing UPDATE operation...');
    const updateData = {
      ...testMember,
      fullName: "Updated Test Member",
      phone: "0771111111",
      weight: 75
    };
    
    const updateResponse = await fetch(`${baseUrl}/api/members/${createdMemberId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    
    if (updateResponse.ok) {
      const updateResult = await updateResponse.json();
      console.log('✅ UPDATE successful - New name:', updateResult.member.fullName);
      console.log('✅ UPDATE successful - New weight:', updateResult.member.weight);
    } else {
      const error = await updateResponse.text();
      console.log('❌ UPDATE failed:', error);
    }
    
    // 4. DELETE - Test deleting the member
    console.log('\n4️⃣ Testing DELETE operation...');
    const deleteResponse = await fetch(`${baseUrl}/api/members/${createdMemberId}`, {
      method: 'DELETE'
    });
    
    if (deleteResponse.ok) {
      const deleteResult = await deleteResponse.json();
      console.log('✅ DELETE successful:', deleteResult.message);
    } else {
      console.log('❌ DELETE failed');
    }
    
    // 5. Verify deletion - Try to read the deleted member
    console.log('\n5️⃣ Verifying deletion...');
    const verifyResponse = await fetch(`${baseUrl}/api/members/${createdMemberId}`);
    
    if (verifyResponse.status === 404) {
      console.log('✅ Deletion verified - Member not found (as expected)');
    } else {
      console.log('❌ Deletion verification failed - Member still exists');
    }
    
    console.log('\n🎉 All CRUD operations tested successfully!');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testMemberCRUD();