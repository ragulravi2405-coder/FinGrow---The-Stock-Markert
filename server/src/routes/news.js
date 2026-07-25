const express = require('express');
const axios = require('axios');
const router = express.Router();

const fallbackArticles = [
  {
    title: 'Markets react to rate and inflation signals',
    description: 'Investors are watching central bank commentary and inflation data closely for the next trend.',
    link: 'https://www.investopedia.com/',
    pubDate: new Date().toISOString()
  },
  {
    title: 'Retail investors keep leaning into diversified portfolios',
    description: 'Long-term planning and disciplined contributions continue to shape the current market environment.',
    link: 'https://www.bloomberg.com/',
    pubDate: new Date().toISOString()
  },
  {
    title: 'Sustainable investing remains a fast-growing theme',
    description: 'More households and institutions are aligning financial goals with environmental and social priorities.',
    link: 'https://www.cnbc.com/',
    pubDate: new Date().toISOString()
  }
];

router.get('/', async (req, res) => {
  try {
    if (process.env.NEWSDATA_API_KEY) {
      const response = await axios.get('https://newsdata.io/api/1/news', {
        params: {
          apikey: process.env.NEWSDATA_API_KEY,
          category: 'business,finance',
          language: 'en',
          country: 'us'
        }
      });

      const articles = (response.data.results || []).slice(0, 8).map((item) => ({
        title: item.title,
        description: item.description || item.content || 'No description available',
        link: item.link,
        pubDate: item.pubDate || new Date().toISOString()
      }));

      if (articles.length > 0) {
        return res.json(articles);
      }
    }

    const rssResponse = await axios.get('https://api.rss2json.com/v1/api.json', {
      params: {
        rss_url: 'https://feeds.finance.yahoo.com/rss/2.0/headline?s=^GSPC,^IXIC,^DJI&region=US&lang=en-US'
      }
    });

    const rssArticles = (rssResponse.data.items || []).slice(0, 8).map((item) => ({
      title: item.title,
      description: item.description || 'No description available',
      link: item.link,
      pubDate: item.pubDate || new Date().toISOString()
    }));

    return res.json(rssArticles.length > 0 ? rssArticles : fallbackArticles);
  } catch (error) {
    return res.json(fallbackArticles);
  }
});

module.exports = router;
