import { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, Stack } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/auth/login', form);
      localStorage.setItem('fingrow_token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, bgcolor: 'background.default' }}>
      <Card sx={{ width: '100%', maxWidth: 460, p: 1 }}>
        <CardContent>
          <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom>FinGrow</Typography>
          <Typography color="text.secondary" mb={3}>Track your money, investments, and goals in one place.</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField label="Email" type="email" fullWidth required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <TextField label="Password" type="password" fullWidth required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <Button type="submit" variant="contained" size="large">Login</Button>
            </Stack>
          </Box>
          <Typography mt={2}>
            Don&apos;t have an account? <Link to="/register">Create one</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
