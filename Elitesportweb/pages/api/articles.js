import dbConnect from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();

  try {
    // Mock articles data - replace with actual database query
    const articles = [
      {
        id: '1',
        title: 'The Benefits of CrossFit Training',
        author: 'Dr. Emily Rodriguez',
        readTime: '5 min read',
        category: 'Fitness',
        excerpt: 'Discover how CrossFit can transform your fitness journey and improve overall health.',
        date: '2024-01-15',
        content: 'Full article content here...'
      },
      {
        id: '2',
        title: 'Nutrition Tips for Athletes',
        author: 'Nutritionist Mark Thompson',
        readTime: '8 min read',
        category: 'Nutrition',
        excerpt: 'Essential nutrition guidelines to fuel your workouts and optimize performance.',
        date: '2024-01-12',
        content: 'Full article content here...'
      },
      {
        id: '3',
        title: 'Mental Health and Exercise',
        author: 'Dr. Sarah Williams',
        readTime: '6 min read',
        category: 'Wellness',
        excerpt: 'How regular exercise can boost your mental health and reduce stress levels.',
        date: '2024-01-10',
        content: 'Full article content here...'
      }
    ];

    res.status(200).json({
      success: true,
      articles
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
}