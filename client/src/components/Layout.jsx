import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, Drawer, List, ListItemButton, ListItemText, IconButton, Stack } from '@mui/material';
import { Menu as MenuIcon, Dashboard as DashboardIcon, ShowChart as ShowChartIcon, PlaylistAddCheck as PlaylistAddCheckIcon, Flag as FlagIcon, Calculate as CalculateIcon, NewReleases as NewReleasesIcon, Chat as ChatIcon, AdminPanelSettings as AdminPanelSettingsIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Portfolio', path: '/portfolio', icon: <ShowChartIcon /> },
  { label: 'Watchlist', path: '/watchlist', icon: <PlaylistAddCheckIcon /> },
  { label: 'Goals', path: '/goals', icon: <FlagIcon /> },
  { label: 'Calculators', path: '/calculators', icon: <CalculateIcon /> },
  { label: 'News', path: '/news', icon: <NewReleasesIcon /> },
  { label: 'Chat', path: '/chat', icon: <ChatIcon /> },
  { label: 'Admin', path: '/admin', icon: <AdminPanelSettingsIcon /> }
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('fingrow_token');
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ width: 240, pt: 2 }}>
      <Typography variant="h6" sx={{ px: 2, pb: 2, fontWeight: 700, color: 'primary.main' }}>
        FinGrow
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItemButton key={item.path} component={Link} to={item.path} selected={location.pathname === item.path} onClick={() => setMobileOpen(false)}>
            {item.icon}
            <ListItemText primary={item.label} sx={{ ml: 1 }} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #e5eefc', backdropFilter: 'blur(8px)' }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" sx={{ mr: 2, display: { md: 'none' } }} onClick={() => setMobileOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, color: 'primary.main' }}>
            FinGrow
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
            <Button color="inherit" onClick={logout} startIcon={<LogoutIcon />}>Logout</Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex' }}>
        <Box component="nav" sx={{ display: { xs: 'none', md: 'block' }, width: 240, minHeight: 'calc(100vh - 64px)', borderRight: '1px solid #e5eefc', bgcolor: 'background.paper' }}>
          {drawer}
        </Box>
        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} variant="temporary" ModalProps={{ keepMounted: true }}>
          {drawer}
        </Drawer>
        <Container maxWidth="xl" sx={{ py: 4, flexGrow: 1 }}>
          <Outlet />
        </Container>
      </Box>
    </>
  );
}
