import dbConnect from '../../lib/mongodb';
import Video from '../../models/Video';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const videos = await Video.find({ isActive: true }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, videos });
    } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).json({ error: 'Failed to fetch videos' });
    }
  } else if (req.method === 'POST') {
    try {
      const { id, ...videoData } = req.body;
      
      // If ID provided, update existing video
      if (id) {
        const updatedVideo = await Video.findByIdAndUpdate(id, videoData, { new: true });
        if (!updatedVideo) {
          return res.status(404).json({ error: 'Video not found' });
        }
        return res.status(200).json({ success: true, video: updatedVideo });
      }
      
      // Create new video
      const video = new Video(videoData);
      await video.save();
      res.status(201).json({ success: true, video });
    } catch (error) {
      console.error('Error saving video:', error);
      res.status(500).json({ error: 'Failed to save video' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
