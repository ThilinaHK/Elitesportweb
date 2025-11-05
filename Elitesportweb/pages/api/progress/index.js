import dbConnect from '../../../lib/mongodb';
import Progress from '../../../models/Progress';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const { memberId } = req.query;
      const filter = memberId ? { memberId } : {};
      const progress = await Progress.find(filter).sort({ date: -1 });
      res.status(200).json(progress);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch progress' });
    }
  }

  if (req.method === 'POST') {
    try {
      const progress = new Progress(req.body);
      await progress.save();
      res.status(201).json(progress);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create progress' });
    }
  }
}