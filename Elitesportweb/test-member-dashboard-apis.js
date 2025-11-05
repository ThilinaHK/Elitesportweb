// Test script for Member Dashboard API endpoints
const testMemberDashboardAPIs = async () => {
  // Test member ID - replace with actual member ID from your database
  const testMemberId = '507f1f77bcf86cd799439011'; // Replace with real member ID
  
  console.log('🔍 Testing Member Dashboard API Endpoints');
  console.log('==========================================');
  
  const baseUrl = 'http://localhost:3000';
  
  // Test 1: Get Member Details
  console.log('\n1. Testing Member Details API');
  console.log('GET /api/members/[id]');
  try {
    const memberResponse = await fetch(`${baseUrl}/api/members/${testMemberId}`);
    const memberData = await memberResponse.json();
    
    if (memberResponse.ok) {
      console.log('✅ Member API Success');
      console.log('📋 Member Details:');
      console.log(`   - Name: ${memberData.member?.fullName || 'N/A'}`);
      console.log(`   - Email: ${memberData.member?.email || 'N/A'}`);
      console.log(`   - Phone: ${memberData.member?.phone || 'N/A'}`);
      console.log(`   - Member ID: ${memberData.member?.memberId || 'N/A'}`);
      console.log(`   - Membership Type: ${memberData.member?.membershipType || 'N/A'}`);
      console.log(`   - Status: ${memberData.member?.status || 'N/A'}`);
      console.log(`   - Weight: ${memberData.member?.weight || 'N/A'} kg`);
      console.log(`   - Height: ${memberData.member?.height || 'N/A'} cm`);
      console.log(`   - Emergency Contact: ${memberData.member?.emergencyContact || 'N/A'}`);
      console.log(`   - Medical Conditions: ${memberData.member?.medicalConditions || 'None'}`);
      console.log(`   - Join Date: ${memberData.member?.joinDate ? new Date(memberData.member.joinDate).toLocaleDateString() : 'N/A'}`);
      console.log(`   - Assigned Classes: ${memberData.member?.assignedClasses?.length || 0} classes`);
    } else {
      console.log('❌ Member API Failed:', memberData.error);
    }
  } catch (error) {
    console.log('❌ Member API Error:', error.message);
  }
  
  // Test 2: Get Member Attendance
  console.log('\n2. Testing Member Attendance API');
  console.log('GET /api/attendance/member/[memberId]');
  try {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    
    const attendanceResponse = await fetch(`${baseUrl}/api/attendance/member/${testMemberId}?month=${month}&year=${year}`);
    const attendanceData = await attendanceResponse.json();
    
    if (attendanceResponse.ok) {
      console.log('✅ Attendance API Success');
      console.log('📊 Attendance Statistics:');
      console.log(`   - Total Classes: ${attendanceData.statistics?.totalClasses || 0}`);
      console.log(`   - Present: ${attendanceData.statistics?.present || 0}`);
      console.log(`   - Absent: ${attendanceData.statistics?.absent || 0}`);
      console.log(`   - Late: ${attendanceData.statistics?.late || 0}`);
      console.log(`   - Attendance Rate: ${attendanceData.statistics?.attendancePercentage || 0}%`);
      console.log(`   - Records Count: ${attendanceData.attendance?.length || 0}`);
    } else {
      console.log('❌ Attendance API Failed:', attendanceData.error);
    }
  } catch (error) {
    console.log('❌ Attendance API Error:', error.message);
  }
  
  // Test 3: Get Member Classes
  console.log('\n3. Testing Member Classes API');
  console.log('GET /api/member-classes/[id]');
  try {
    const classesResponse = await fetch(`${baseUrl}/api/member-classes/${testMemberId}`);
    const classesData = await classesResponse.json();
    
    if (classesResponse.ok) {
      console.log('✅ Classes API Success');
      console.log('🏋️ Member Classes:');
      if (classesData.classes && classesData.classes.length > 0) {
        classesData.classes.forEach((cls, index) => {
          console.log(`   ${index + 1}. ${cls.name}`);
          console.log(`      - Category: ${cls.category}`);
          console.log(`      - Instructor: ${cls.instructor}`);
          console.log(`      - Schedule: ${cls.schedule || cls.day} ${cls.time}`);
          console.log(`      - Duration: ${cls.duration} min`);
          console.log(`      - Capacity: ${cls.capacity}`);
        });
      } else {
        console.log('   - No classes assigned');
      }
    } else {
      console.log('❌ Classes API Failed:', classesData.error);
    }
  } catch (error) {
    console.log('❌ Classes API Error:', error.message);
  }
  
  // Test 4: Get Member Notifications
  console.log('\n4. Testing Member Notifications API');
  console.log('GET /api/member-notifications/[id]');
  try {
    const notificationsResponse = await fetch(`${baseUrl}/api/member-notifications/${testMemberId}`);
    const notificationsData = await notificationsResponse.json();
    
    if (notificationsResponse.ok) {
      console.log('✅ Notifications API Success');
      console.log('🔔 Member Notifications:');
      if (notificationsData.notifications && notificationsData.notifications.length > 0) {
        notificationsData.notifications.forEach((notification, index) => {
          console.log(`   ${index + 1}. ${notification.title}`);
          console.log(`      - Message: ${notification.message}`);
          console.log(`      - Type: ${notification.type}`);
          console.log(`      - Date: ${new Date(notification.createdAt).toLocaleDateString()}`);
        });
      } else {
        console.log('   - No notifications');
      }
    } else {
      console.log('❌ Notifications API Failed:', notificationsData.error);
    }
  } catch (error) {
    console.log('❌ Notifications API Error:', error.message);
  }
  
  // Test 5: Get Member Diet Plans
  console.log('\n5. Testing Member Diet Plans API');
  console.log('GET /api/member-diet/[id]');
  try {
    const dietResponse = await fetch(`${baseUrl}/api/member-diet/${testMemberId}`);
    const dietData = await dietResponse.json();
    
    if (dietResponse.ok) {
      console.log('✅ Diet Plans API Success');
      console.log('🥗 Member Diet Plans:');
      if (dietData.diets && dietData.diets.length > 0) {
        dietData.diets.forEach((diet, index) => {
          console.log(`   ${index + 1}. ${diet.planName}`);
          console.log(`      - Description: ${diet.description}`);
          console.log(`      - Calories: ${diet.calories || 'N/A'}`);
          console.log(`      - Duration: ${diet.duration || 'N/A'}`);
          console.log(`      - Meals: ${diet.meals?.length || 0} meals`);
        });
      } else {
        console.log('   - No diet plans assigned');
      }
    } else {
      console.log('❌ Diet Plans API Failed:', dietData.error);
    }
  } catch (error) {
    console.log('❌ Diet Plans API Error:', error.message);
  }
  
  // Test 6: Get Member Exercise Plans
  console.log('\n6. Testing Member Exercise Plans API');
  console.log('GET /api/member-exercises/[id]');
  try {
    const exerciseResponse = await fetch(`${baseUrl}/api/member-exercises/${testMemberId}`);
    const exerciseData = await exerciseResponse.json();
    
    if (exerciseResponse.ok) {
      console.log('✅ Exercise Plans API Success');
      console.log('💪 Member Exercise Plans:');
      if (exerciseData.exercises && exerciseData.exercises.length > 0) {
        exerciseData.exercises.forEach((exercise, index) => {
          console.log(`   ${index + 1}. ${exercise.planName}`);
          console.log(`      - Description: ${exercise.description}`);
          console.log(`      - Duration: ${exercise.duration || 'N/A'}`);
          console.log(`      - Exercises: ${exercise.exercises?.length || 0} exercises`);
        });
      } else {
        console.log('   - No exercise plans assigned');
      }
    } else {
      console.log('❌ Exercise Plans API Failed:', exerciseData.error);
    }
  } catch (error) {
    console.log('❌ Exercise Plans API Error:', error.message);
  }
  
  console.log('\n==========================================');
  console.log('✅ Member Dashboard API Testing Complete');
  console.log('==========================================');
};

// Usage Instructions
console.log('📝 USAGE INSTRUCTIONS:');
console.log('1. Start your Next.js development server: npm run dev');
console.log('2. Replace testMemberId with a real member ID from your database');
console.log('3. Run this script in browser console or Node.js');
console.log('4. Check the console output for API responses and user details');
console.log('');
console.log('🔧 To get a real member ID:');
console.log('1. Go to your admin panel');
console.log('2. Check the members list');
console.log('3. Copy a member ID from the database');
console.log('');

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = testMemberDashboardAPIs;
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  console.log('🚀 Ready to test! Call testMemberDashboardAPIs() to start testing.');
}