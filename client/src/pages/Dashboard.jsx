import { Card, CardContent, Typography, Grid, Stack, Chip, Box } from '@mui/material';
import { TrendingUp, AccountBalanceWallet, Savings, Assessment } from '@mui/icons-material';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import ProfileUploader from '../components/profile/ProfileUploader';

const stats = [
  { title: 'Net Worth', value: '$24.8k', icon: <AccountBalanceWallet color="primary" /> },
  { title: 'Invested', value: '$18.2k', icon: <TrendingUp color="secondary" /> },
  { title: 'Savings', value: '$6.6k', icon: <Savings color="success" /> },
  { title: 'Goals', value: '3 Active', icon: <Assessment color="info" /> }
];

const growthData = [
  { month: 'Jan', value: 12 },
  { month: 'Feb', value: 15 },
  { month: 'Mar', value: 18 },
  { month: 'Apr', value: 20 },
  { month: 'May', value: 24 },
  { month: 'Jun', value: 28 }
];

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>Welcome back</Typography>
      <Typography color="text.secondary" mb={3}>Your personal finance overview at a glance.</Typography>
      <Card sx={{ mb: 3, p: 1 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>Profile</Typography>
          <ProfileUploader />
        </CardContent>
      </Card>
      <Grid container spacing={3}>
        {stats.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.title}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  {item.icon}
                  <Box>
                    <Typography variant="h6" fontWeight={700}>{item.value}</Typography>
                    <Typography color="text.secondary">{item.title}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700}>Growth trend</Typography>
          <Box sx={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={growthData}>
                <CartesianGrid stroke="#e5eefc" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#2563eb" fill="#93c5fd" />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700}>This week</Typography>
          <Typography color="text.secondary" mt={1}>Use the modular finance modules to add portfolios, watchlists, goals, calculators, and AI insights.</Typography>
          <Stack direction="row" spacing={1} mt={2}>
            <Chip label="Secure auth" color="primary" />
            <Chip label="Responsive UI" color="secondary" />
            <Chip label="Mobile ready" color="success" />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
