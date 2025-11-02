import dbConnect from '../../../lib/mongodb';
import Post from '../../../models/Post';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid instructor ID format' });
  }

  await dbConnect();

  try {
    const posts = await Post.find({ instructorId: id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error('Instructor posts API error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}