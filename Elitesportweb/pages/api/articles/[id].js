import dbConnect from '../../../lib/mongodb';
import Article from '../../../models/Article';

export default async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  if (req.method === 'PUT') {
    try {
      const article = await Article.findByIdAndUpdate(id, req.body, { new: true });
      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }
      res.status(200).json({ success: true, article });
    } catch (error) {
      console.error('Error updating article:', error);
      res.status(500).json({ error: 'Failed to update article' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const article = await Article.findByIdAndDelete(id);
      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }
      res.status(200).json({ success: true, message: 'Article deleted successfully' });
    } catch (error) {
      console.error('Error deleting article:', error);
      res.status(500).json({ error: 'Failed to delete article' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}