import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Box, Chip, Stack } from '@mui/material';
import axios from 'axios';

export default function Admin() {
  const [stats, setStats] = useState({ users: 0, goals: 0, investments: 0, watchlist: 0 });

  useEffect(() => {
    const token = localStorage.getItem('fingrow_token');
    const load = async () => {
      try {
        const [usersRes, goalsRes, investmentsRes, watchlistRes] = await Promise.all([
          axios.get('/api/auth/users', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/finance/goals', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/finance/investments', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/finance/watchlist', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setStats({
          users: usersRes.data.length || 0,
          goals: goalsRes.data.length || 0,
          investments: investmentsRes.data.length || 0,
          watchlist: watchlistRes.data.length || 0
        });
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, []);

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>Admin Panel</Typography>
      <Typography color="text.secondary" mb={3}>Monitor the platform health and core finance activity.</Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={3}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography color="text.secondary">Users</Typography>
            <Typography variant="h4" fontWeight={700}>{stats.users}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography color="text.secondary">Goals</Typography>
            <Typography variant="h4" fontWeight={700}>{stats.goals}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography color="text.secondary">Investments</Typography>
            <Typography variant="h4" fontWeight={700}>{stats.investments}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography color="text.secondary">Watchlist</Typography>
            <Typography variant="h4" fontWeight={700}>{stats.watchlist}</Typography>
          </CardContent>
        </Card>
      </Stack>
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>Operations</Typography>
          <List>
            {['Review suspicious activity', 'Approve premium insights', 'Monitor finance content health', 'Manage growth and retention'].map((item) => (
              <ListItem key={item} divider>
                <ListItemText primary={item} />
                <Chip label="Live" color="success" />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
