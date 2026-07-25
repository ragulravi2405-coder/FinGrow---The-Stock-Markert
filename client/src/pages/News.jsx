import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Stack, Box, Chip, CircularProgress, Link as MuiLink } from '@mui/material';
import axios from 'axios';

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/news');
        setArticles(res.data);
      } catch (error) {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>Financial News</Typography>
      <Typography color="text.secondary" mb={3}>Live market and finance updates from a public news API.</Typography>

      {loading ? (
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={24} />
            <Typography>Loading latest headlines...</Typography>
          </CardContent>
        </Card>
      ) : articles.length > 0 ? (
        <Stack spacing={2}>
          {articles.map((article, index) => (
            <Card key={`${article.title}-${index}`}>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" mb={1}>
                  <Chip label="Live" color="primary" size="small" />
                  <Typography variant="caption" color="text.secondary">
                    {new Date(article.pubDate).toLocaleString()}
                  </Typography>
                </Stack>
                <Typography fontWeight={700}>{article.title}</Typography>
                <Typography color="text.secondary" mt={1}>{article.description}</Typography>
                <MuiLink href={article.link} target="_blank" rel="noreferrer" underline="hover" sx={{ mt: 1, display: 'inline-block' }}>
                  Read more
                </MuiLink>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        <Card>
          <CardContent>
            <Typography color="text.secondary">News is temporarily unavailable. Please try again shortly.</Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
