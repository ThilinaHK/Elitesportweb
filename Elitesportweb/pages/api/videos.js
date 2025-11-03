import dbConnect from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();

  try {
    // Mock videos data - replace with actual database query
    const videos = [
      {
        id: '1',
        title: 'CrossFit Basics for Beginners',
        duration: '15:30',
        instructor: 'John Smith',
        description: 'Learn the fundamental movements of CrossFit',
        url: 'https://example.com/video1'
      },
      {
        id: '2',
        title: 'Karate Forms and Techniques',
        duration: '22:45',
        instructor: 'Sarah Johnson',
        description: 'Master basic karate forms and self-defense techniques',
        url: 'https://example.com/video2'
      },
      {
        id: '3',
        title: 'Zumba Dance Workout',
        duration: '18:20',
        instructor: 'Maria Garcia',
        description: 'High-energy dance workout for all fitness levels',
        url: 'https://example.com/video3'
      }
    ];

    res.status(200).json({
      success: true,
      videos
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
}