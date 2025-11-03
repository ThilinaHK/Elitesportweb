import { useState, useEffect } from 'react';
import { showToast } from '../components/Toast';

export default function InstructorAPITest() {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [instructorId, setInstructorId] = useState('');

  const runTests = async () => {
    if (!instructorId.trim()) {
      showToast('Please enter an instructor ID', 'error');
      return;
    }

    setLoading(true);
    const results = [];

    // Test 1: Get Instructor Details
    try {
      const response = await fetch(`/api/instructors/${instructorId}`);
      const data = await response.json();
      results.push({
        test: 'Get Instructor Details',
        status: response.ok ? 'PASS' : 'FAIL',
        message: response.ok ? `Found: ${data.name}` : data.error,
        data: response.ok ? data : null
      });
    } catch (error) {
      results.push({
        test: 'Get Instructor Details',
        status: 'ERROR',
        message: error.message
      });
    }

    // Test 2: Get Instructor Classes
    try {
      const response = await fetch(`/api/instructor-classes/${instructorId}`);
      const data = await response.json();
      results.push({
        test: 'Get Instructor Classes',
        status: response.ok ? 'PASS' : 'FAIL',
        message: response.ok ? `Found ${data.classes?.length || 0} classes` : data.message,
        data: response.ok ? data.classes : null
      });
    } catch (error) {
      results.push({
        test: 'Get Instructor Classes',
        status: 'ERROR',
        message: error.message
      });
    }

    // Test 3: Get Instructor Members
    try {
      const response = await fetch(`/api/instructor-members/${instructorId}`);
      const data = await response.json();
      results.push({
        test: 'Get Instructor Members',
        status: response.ok ? 'PASS' : 'FAIL',
        message: response.ok ? `Found ${data.members?.length || 0} members` : data.message,
        data: response.ok ? data.members : null
      });
    } catch (error) {
      results.push({
        test: 'Get Instructor Members',
        status: 'ERROR',
        message: error.message
      });
    }

    // Test 4: Get Instructor Posts
    try {
      const response = await fetch(`/api/instructor-posts/${instructorId}`);
      const data = await response.json();
      results.push({
        test: 'Get Instructor Posts',
        status: response.ok ? 'PASS' : 'FAIL',
        message: response.ok ? `Found ${data.posts?.length || 0} posts` : data.message,
        data: response.ok ? data.posts : null
      });
    } catch (error) {
      results.push({
        test: 'Get Instructor Posts',
        status: 'ERROR',
        message: error.message
      });
    }

    // Test 5: Create Test Post
    try {
      const postData = {
        title: 'API Test Post',
        description: 'This is a test post created via API testing',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        category: 'general',
        instructorId: instructorId,
        instructorName: 'Test Instructor',
        type: 'normal'
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });

      const data = await response.json();
      results.push({
        test: 'Create Post',
        status: response.ok ? 'PASS' : 'FAIL',
        message: response.ok ? `Created: ${data.title}` : data.error,
        data: response.ok ? data : null
      });
    } catch (error) {
      results.push({
        test: 'Create Post',
        status: 'ERROR',
        message: error.message
      });
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Instructor Dashboard API Test</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Enter Instructor ID (MongoDB ObjectId)"
          value={instructorId}
          onChange={(e) => setInstructorId(e.target.value)}
          style={{ 
            padding: '0.5rem', 
            width: '300px', 
            marginRight: '1rem',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
        <button 
          onClick={runTests}
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Run Tests'}
        </button>
      </div>

      {testResults.length > 0 && (
        <div>
          <h2>Test Results</h2>
          {testResults.map((result, index) => (
            <div 
              key={index}
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '1rem',
                marginBottom: '1rem',
                background: result.status === 'PASS' ? '#d4edda' : 
                           result.status === 'FAIL' ? '#f8d7da' : '#fff3cd'
              }}
            >
              <h3 style={{ 
                margin: '0 0 0.5rem 0',
                color: result.status === 'PASS' ? '#155724' : 
                       result.status === 'FAIL' ? '#721c24' : '#856404'
              }}>
                {result.status} - {result.test}
              </h3>
              <p style={{ margin: '0.5rem 0' }}>{result.message}</p>
              {result.data && (
                <details style={{ marginTop: '0.5rem' }}>
                  <summary>View Data</summary>
                  <pre style={{ 
                    background: '#f8f9fa', 
                    padding: '0.5rem', 
                    borderRadius: '4px',
                    overflow: 'auto',
                    fontSize: '12px'
                  }}>
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}