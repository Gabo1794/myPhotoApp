import React from 'react'
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, useMediaQuery, useTheme, CircularProgress } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';


const Index = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loggingOut, setLoggingOut] = React.useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem component={Link} to="/" onClick={handleMenuClose}>Inicio</MenuItem>
              <MenuItem component={Link} to="/album" onClick={handleMenuClose}>Álbum</MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }} disabled={loggingOut}>
                {loggingOut ? <CircularProgress size={20} /> : 'Cerrar Sesión'}
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Mi Aplicación
            </Typography>
            {user && (
              <Typography variant="body2" sx={{ mr: 2 }}>
                {user.email}
              </Typography>
            )}
            <Button color="inherit" component={Link} to="/">Inicio</Button>
            <Button color="inherit" component={Link} to="/album">Álbum</Button>
            <Button 
              color="inherit" 
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? <CircularProgress size={20} /> : 'Cerrar Sesión'}
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );  
}

export default Index;