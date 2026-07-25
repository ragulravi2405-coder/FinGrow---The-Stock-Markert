import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, LinearProgress, Stack, Box, TextField, Button, Alert } from '@mui/material';
import axios from 'axios';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({ title: '', targetAmount: 1000, savedAmount: 0 });
  const [message, setMessage] = useState('');

  const loadGoals = async () => {
    const token = localStorage.getItem('fingrow_token');
    try {
      const { data } = await axios.get('/api/finance/goals', { headers: { Authorization: `Bearer ${token}` } });
      setGoals(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('fingrow_token');
    try {
      await axios.post('/api/finance/goals', form, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Goal created successfully');
      setForm({ title: '', targetAmount: 1000, savedAmount: 0 });
      loadGoals();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not create goal');
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>Goals</Typography>
      <Typography color="text.secondary" mb={3}>Stay committed with milestone-based savings plans.</Typography>
      {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box component="form" onSubmit={handleAdd}>
            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <TextField label="Goal title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <TextField label="Target amount" type="number" required value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: Number(e.target.value) })} />
              <TextField label="Saved amount" type="number" value={form.savedAmount} onChange={(e) => setForm({ ...form, savedAmount: Number(e.target.value) })} />
              <Button type="submit" variant="contained">Add Goal</Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
      <Stack spacing={2}>
        {goals.map((goal) => {
          const progress = Math.min(100, (goal.savedAmount / goal.targetAmount) * 100 || 0);
          return (
            <Card key={goal._id}>
              <CardContent>
                <Typography fontWeight={700}>{goal.title}</Typography>
                <Typography color="text.secondary">Target {goal.targetAmount}</Typography>
                <LinearProgress variant="determinate" value={progress} color="primary" sx={{ mt: 2, height: 10, borderRadius: 8 }} />
                <Typography mt={1}>{progress.toFixed(0)}% completed</Typography>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
}
