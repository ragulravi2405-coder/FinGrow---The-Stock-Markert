import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Watchlist from './pages/Watchlist';
import Goals from './pages/Goals';
import Calculators from './pages/Calculators';
import News from './pages/News';
import Chat from './pages/Chat';
import Admin from './pages/Admin';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1d4ed8' },
    secondary: { main: '#16a34a' },
    background: { default: '#f8fbff', paper: '#ffffff' }
  },
  shape: { borderRadius: 12 }
});

function App() {
  const token = localStorage.getItem('fingrow_token');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Layout />}>
            <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" replace />} />
            <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" replace />} />
            <Route path="/portfolio" element={token ? <Portfolio /> : <Navigate to="/login" replace />} />
            <Route path="/watchlist" element={token ? <Watchlist /> : <Navigate to="/login" replace />} />
            <Route path="/goals" element={token ? <Goals /> : <Navigate to="/login" replace />} />
            <Route path="/calculators" element={token ? <Calculators /> : <Navigate to="/login" replace />} />
            <Route path="/news" element={token ? <News /> : <Navigate to="/login" replace />} />
            <Route path="/chat" element={token ? <Chat /> : <Navigate to="/login" replace />} />
            <Route path="/admin" element={token ? <Admin /> : <Navigate to="/login" replace />} />
          </Route>
        </Routes>
      </Box>
    </ThemeProvider>
  );
}

export default App;
