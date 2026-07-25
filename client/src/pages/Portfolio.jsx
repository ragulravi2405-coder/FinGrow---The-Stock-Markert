import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Stack, Chip, Box, TextField, Button, List, ListItem, ListItemText, Alert } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const chartData = [
  { name: 'Stocks', value: 45, color: '#2563eb' },
  { name: 'Mutual Funds', value: 30, color: '#16a34a' },
  { name: 'Crypto', value: 15, color: '#f59e0b' },
  { name: 'Cash', value: 10, color: '#7c3aed' }
];

export default function Portfolio() {
  const [investments, setInvestments] = useState([]);
  const [form, setForm] = useState({ symbol: '', name: '', type: 'stock', quantity: 1, price: 0 });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const loadInvestments = async () => {
    const token = localStorage.getItem('fingrow_token');
    try {
      const { data } = await axios.get('/api/finance/investments', { headers: { Authorization: `Bearer ${token}` } });
      setInvestments(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadInvestments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('fingrow_token');
    try {
      if (editingId) {
        await axios.put(`/api/finance/investments/${editingId}`, form, { headers: { Authorization: `Bearer ${token}` } });
        setMessage('Investment updated');
      } else {
        await axios.post('/api/finance/investments', form, { headers: { Authorization: `Bearer ${token}` } });
        setMessage('Investment created');
      }
      setForm({ symbol: '', name: '', type: 'stock', quantity: 1, price: 0 });
      setEditingId(null);
      loadInvestments();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to save investment');
    }
  };

  const handleEdit = (investment) => {
    setEditingId(investment._id);
    setForm({
      symbol: investment.symbol,
      name: investment.name,
      type: investment.type,
      quantity: investment.quantity,
      price: investment.price
    });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('fingrow_token');
    try {
      await axios.delete(`/api/finance/investments/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Investment deleted');
      loadInvestments();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete investment');
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>Portfolio</Typography>
      <Typography color="text.secondary" mb={3}>Track allocation across your investment buckets.</Typography>
      {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700}>Allocation</Typography>
              <Box sx={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={chartData} dataKey="value" outerRadius={90} fill="#8884d8" label>
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700}>Highlights</Typography>
              <Stack spacing={1.5} mt={2}>
                {chartData.map((item) => (
                  <Box key={item.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: item.color }} />
                      <Typography>{item.name}</Typography>
                    </Stack>
                    <Chip label={`${item.value}%`} color="primary" variant="outlined" />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700}>{editingId ? 'Edit investment' : 'Add investment'}</Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <TextField label="Symbol" required value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} />
              <TextField label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <TextField label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
              <TextField label="Quantity" type="number" required value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
              <TextField label="Price" type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              <Button type="submit" variant="contained">{editingId ? 'Save' : 'Add'}</Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700}>Investments</Typography>
          <List>
            {investments.map((investment) => (
              <ListItem key={investment._id} divider secondaryAction={
                <Stack direction="row" spacing={1}>
                  <Button size="small" onClick={() => handleEdit(investment)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(investment._id)}>Delete</Button>
                </Stack>
              }>
                <ListItemText primary={`${investment.symbol} — ${investment.name}`} secondary={`Qty: ${investment.quantity} • Price: $${investment.price} • Type: ${investment.type}`} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
