import dbConnect from '../../lib/mongodb';
import Article from '../../models/Article';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const articles = await Article.find({}).sort({ createdAt: -1 });
      res.status(200).json({ success: true, articles });
    } catch (error) {
      console.error('Error fetching articles:', error);
      res.status(500).json({ error: 'Failed to fetch articles' });
    }
  } else if (req.method === 'POST') {
    try {
      const { id, ...articleData } = req.body;
      
      if (id) {
        // Update existing article
        const updatedArticle = await Article.findByIdAndUpdate(id, articleData, { new: true });
        if (!updatedArticle) {
          return res.status(404).json({ error: 'Article not found' });
        }
        return res.status(200).json({ success: true, article: updatedArticle });
      }
      
      // Create new article
      const article = new Article({ ...articleData, isActive: true });
      await article.save();
      res.status(201).json({ success: true, article });
    } catch (error) {
      console.error('Error saving article:', error);
      res.status(500).json({ error: 'Failed to save article' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
