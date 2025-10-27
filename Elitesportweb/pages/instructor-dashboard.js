import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function InstructorDashboard() {
  const [instructor, setInstructor] = useState(null);
  const [instructorId, setInstructorId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('classes');
  const [loading, setLoading] = useState(true);
  const [postForm, setPostForm] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    category: 'general'
  });
  const [showPostForm, setShowPostForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedInstructorId = localStorage.getItem('instructorId');
    if (!storedInstructorId) {
      router.push('/instructor-login');
      return;
    }
    setInstructorId(storedInstructorId);
    fetchInstructorData(storedInstructorId);
  }, []);

  const fetchInstructorData = async (id) => {
    try {
      const [classesRes, membersRes, postsRes] = await Promise.all([
        fetch(`/api/instructor-classes/${id}`),
        fetch(`/api/instructor-members/${id}`),
        fetch(`/api/instructor-posts/${id}`)
      ]);

      const classesData = await classesRes.json();
      const membersData = await membersRes.json();
      const postsData = await postsRes.json();

      setClasses(classesData.classes || []);
      setMembers(membersData.members || []);
      setPosts(postsData.posts || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!instructorId) {
      alert('Instructor ID not found. Please login again.');
      return;
    }
    
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...postForm,
          instructorId: instructorId,
          instructorName: 'Instructor',
          type: 'normal'
        })
      });
      
      if (response.ok) {
        fetchInstructorData(instructorId);
        setShowPostForm(false);
        setPostForm({ title: '', description: '', youtubeUrl: '', category: 'general' });
        alert('Post created successfully!');
      } else {
        const errorData = await response.json();
        alert('Failed to create post: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post: ' + error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('instructorId');
    router.push('/');
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ background: 'white', padding: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: 0, color: '#333' }}>Instructor Dashboard</h1>
          <button onClick={logout} style={{ padding: '0.5rem 1rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', marginBottom: '2rem', borderBottom: '1px solid #ddd' }}>
          {['classes', 'members', 'posts'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '1rem 2rem',
                background: activeTab === tab ? '#007bff' : 'transparent',
                color: activeTab === tab ? 'white' : '#333',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #007bff' : '2px solid transparent',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'classes' && (
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>My Classes</h2>
            {classes.length === 0 ? (
              <p>No classes assigned.</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {classes.map(cls => (
                  <div key={cls._id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#007bff' }}>{cls.name}</h3>
                    <p><strong>Day:</strong> {cls.day}</p>
                    <p><strong>Time:</strong> {cls.time}</p>
                    <p><strong>Duration:</strong> {cls.duration} minutes</p>
                    <p><strong>Category:</strong> {cls.category}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>My Students</h2>
            {members.length === 0 ? (
              <p>No students in your classes.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                      <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Phone</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Classes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(member => (
                      <tr key={member._id}>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{member.fullName || member.name}</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{member.email}</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{member.phone}</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                          {member.classNames?.join(', ') || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'posts' && (
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, color: '#333' }}>My Posts</h2>
              <button 
                onClick={() => setShowPostForm(!showPostForm)}
                style={{ padding: '0.5rem 1rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                {showPostForm ? 'Cancel' : 'Create Post'}
              </button>
            </div>

            {showPostForm && (
              <form onSubmit={handlePostSubmit} style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '4px', marginBottom: '2rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Post Title"
                    value={postForm.title}
                    onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                    required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <input
                    type="url"
                    placeholder="YouTube URL"
                    value={postForm.youtubeUrl}
                    onChange={(e) => setPostForm({...postForm, youtubeUrl: e.target.value})}
                    required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <select
                    value={postForm.category}
                    onChange={(e) => setPostForm({...postForm, category: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="general">General</option>
                    <option value="crossfit">CrossFit</option>
                    <option value="karate">Karate</option>
                    <option value="zumba">Zumba</option>
                  </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <textarea
                    placeholder="Description"
                    value={postForm.description}
                    onChange={(e) => setPostForm({...postForm, description: e.target.value})}
                    required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', height: '80px' }}
                  />
                </div>
                <button type="submit" style={{ padding: '0.5rem 1rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Create Post
                </button>
              </form>
            )}

            {posts.length === 0 ? (
              <p>No posts created yet.</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {posts.map(post => (
                  <div key={post._id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#007bff' }}>{post.title}</h4>
                    <p style={{ margin: '0.5rem 0', color: '#666' }}>{post.description}</p>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      Category: {post.category} | Created: {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}