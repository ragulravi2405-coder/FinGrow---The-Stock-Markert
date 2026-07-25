import { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Stack, Box, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';

export default function Chat() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('Ask Fin AI about your budget, savings, or investing plan.');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('fingrow_token');
      const { data } = await axios.post('/api/ai/chat', { message }, { headers: { Authorization: `Bearer ${token}` } });
      setReply(data.reply || 'No response available');
    } catch (error) {
      setReply(error.response?.data?.message || 'AI service unavailable');
    } finally {
      setLoading(false);
      setMessage('');
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>Fin AI Assistant</Typography>
      <Typography color="text.secondary" mb={3}>Get helpful guidance powered by your finance context.</Typography>
      <Card>
        <CardContent>
          <Alert severity="info" sx={{ mb: 2 }}>{reply}</Alert>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField label="Ask Fin AI" fullWidth value={message} onChange={(e) => setMessage(e.target.value)} />
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Send'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
