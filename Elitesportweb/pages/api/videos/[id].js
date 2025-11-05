import dbConnect from '../../../lib/mongodb';
import Video from '../../../models/Video';

export default async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  if (req.method === 'PUT') {
    try {
      let video = await Video.findByIdAndUpdate(id, req.body, { new: true }).catch(() => null);
      if (!video) {
        video = await Video.findOneAndUpdate({ videoId: id }, req.body, { new: true });
      }
      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }
      res.status(200).json({ success: true, video });
    } catch (error) {
      console.error('Error updating video:', error);
      res.status(500).json({ error: 'Failed to update video' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const video = await Video.findByIdAndDelete(id);
      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }
      res.status(200).json({ success: true, message: 'Video deleted successfully' });
    } catch (error) {
      console.error('Error deleting video:', error);
      res.status(500).json({ error: 'Failed to delete video' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}