import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Chip, Box, TextField, Button, Stack, Alert } from '@mui/material';
import axios from 'axios';

export default function Watchlist() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ symbol: '', name: '', price: 0, change: 0 });
  const [message, setMessage] = useState('');

  const loadWatchlist = async () => {
    const token = localStorage.getItem('fingrow_token');
    try {
      const { data } = await axios.get('/api/finance/watchlist', { headers: { Authorization: `Bearer ${token}` } });
      setItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('fingrow_token');
    try {
      await axios.post('/api/finance/watchlist', form, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Watchlist item added');
      setForm({ symbol: '', name: '', price: 0, change: 0 });
      loadWatchlist();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not add item');
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>Watchlist</Typography>
      <Typography color="text.secondary" mb={3}>Monitor your favorite assets with quick insight.</Typography>
      {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box component="form" onSubmit={handleAdd}>
            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <TextField label="Symbol" required value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} />
              <TextField label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <TextField label="Price" type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              <TextField label="Change (%)" type="number" value={form.change} onChange={(e) => setForm({ ...form, change: Number(e.target.value) })} />
              <Button type="submit" variant="contained">Add</Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <List>
            {items.map((item) => (
              <ListItem key={item._id} divider>
                <ListItemText primary={item.symbol} secondary={item.name} />
                <Typography fontWeight={700}>${item.price}</Typography>
                <Chip label={`${item.change}%`} color={item.change >= 0 ? 'success' : 'error'} sx={{ ml: 2 }} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
