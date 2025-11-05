import dbConnect from '../../lib/mongodb';
import Article from '../../models/Article';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const articles = await Article.find({ isActive: true }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, articles });
    } catch (error) {
      console.error('Error fetching articles:', error);
      res.status(500).json({ error: 'Failed to fetch articles' });
    }
  } else if (req.method === 'POST') {
    try {
      const article = new Article(req.body);
      await article.save();
      res.status(201).json({ success: true, article });
    } catch (error) {
      console.error('Error creating article:', error);
      res.status(500).json({ error: 'Failed to create article' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}