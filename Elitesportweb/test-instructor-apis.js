// Test script for Instructor Dashboard APIs
const testInstructorAPIs = async () => {
  const baseURL = 'http://localhost:3000';
  
  // Test instructor ID (you'll need to replace with actual ID from your database)
  const testInstructorId = '507f1f77bcf86cd799439011'; // Replace with real instructor ID
  
  console.log('🧪 Testing Instructor Dashboard APIs...\n');
  
  // Test 1: Get Instructor Details
  try {
    console.log('1️⃣ Testing GET /api/instructors/[id]');
    const response = await fetch(`${baseURL}/api/instructors/${testInstructorId}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Instructor API working');
      console.log(`   Name: ${data.name}`);
      console.log(`   Email: ${data.email}`);
    } else {
      console.log('❌ Instructor API failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Instructor API error:', error.message);
  }
  
  // Test 2: Get Instructor Classes
  try {
    console.log('\n2️⃣ Testing GET /api/instructor-classes/[id]');
    const response = await fetch(`${baseURL}/api/instructor-classes/${testInstructorId}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Instructor Classes API working');
      console.log(`   Classes found: ${data.classes?.length || 0}`);
    } else {
      console.log('❌ Instructor Classes API failed:', data.message);
    }
  } catch (error) {
    console.log('❌ Instructor Classes API error:', error.message);
  }
  
  // Test 3: Get Instructor Members
  try {
    console.log('\n3️⃣ Testing GET /api/instructor-members/[id]');
    const response = await fetch(`${baseURL}/api/instructor-members/${testInstructorId}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Instructor Members API working');
      console.log(`   Members found: ${data.members?.length || 0}`);
    } else {
      console.log('❌ Instructor Members API failed:', data.message);
    }
  } catch (error) {
    console.log('❌ Instructor Members API error:', error.message);
  }
  
  // Test 4: Get Instructor Posts
  try {
    console.log('\n4️⃣ Testing GET /api/instructor-posts/[id]');
    const response = await fetch(`${baseURL}/api/instructor-posts/${testInstructorId}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Instructor Posts API working');
      console.log(`   Posts found: ${data.posts?.length || 0}`);
    } else {
      console.log('❌ Instructor Posts API failed:', data.message);
    }
  } catch (error) {
    console.log('❌ Instructor Posts API error:', error.message);
  }
  
  // Test 5: Create Post
  try {
    console.log('\n5️⃣ Testing POST /api/posts');
    const postData = {
      title: 'Test Post from API',
      description: 'This is a test post created via API',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      category: 'general',
      instructorId: testInstructorId,
      instructorName: 'Test Instructor',
      type: 'normal'
    };
    
    const response = await fetch(`${baseURL}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Create Post API working');
      console.log(`   Post created: ${data.title}`);
    } else {
      console.log('❌ Create Post API failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Create Post API error:', error.message);
  }
  
  console.log('\n🏁 API Testing Complete!');
};

// Run the test
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  testInstructorAPIs();
} else {
  // Browser environment
  testInstructorAPIs();
}