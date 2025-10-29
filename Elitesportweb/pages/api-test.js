import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function ApiTest() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testEndpoints = [
    '/api/health',
    '/api/members',
    '/api/classes',
    '/api/posts',
    '/api/events'
  ];

  const testApi = async () => {
    setLoading(true);
    const testResults = {};

    for (const endpoint of testEndpoints) {
      try {
        const response = await fetch(endpoint);
        const data = await response.text();
        testResults[endpoint] = {
          status: response.status,
          ok: response.ok,
          data: data.substring(0, 200) + (data.length > 200 ? '...' : '')
        };
      } catch (error) {
        testResults[endpoint] = {
          status: 'ERROR',
          ok: false,
          data: error.message
        };
      }
    }

    setResults(testResults);
    setLoading(false);
  };

  useEffect(() => {
    testApi();
  }, []);

  return (
    <>
      <Head>
        <title>API Test - Elite Sports Academy</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      </Head>

      <div className="container mt-5">
        <div className="row">
          <div className="col-12">
            <h1>API Endpoint Test</h1>
            <button onClick={testApi} className="btn btn-primary mb-4" disabled={loading}>
              {loading ? 'Testing...' : 'Test APIs'}
            </button>

            {Object.keys(results).length > 0 && (
              <div className="row">
                {Object.entries(results).map(([endpoint, result]) => (
                  <div key={endpoint} className="col-md-6 mb-3">
                    <div className={`card ${result.ok ? 'border-success' : 'border-danger'}`}>
                      <div className="card-header">
                        <h6 className="mb-0">{endpoint}</h6>
                        <small className={`badge ${result.ok ? 'bg-success' : 'bg-danger'}`}>
                          Status: {result.status}
                        </small>
                      </div>
                      <div className="card-body">
                        <pre style={{ fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
                          {result.data}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}