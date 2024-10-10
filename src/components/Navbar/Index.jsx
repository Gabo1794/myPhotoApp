import React from 'react'
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';


const Index = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  // Check if the viewport width is small
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
              <MenuItem component={Link} to="/my-photos" onClick={handleMenuClose}>Mis Fotos</MenuItem>
              {/* <MenuItem component={Link} to="/camera" onClick={handleMenuClose}>Cámara</MenuItem> */}
              <MenuItem component={Link} to="/logout" onClick={handleMenuClose}>Cerrar Sesión</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Mi Aplicación
            </Typography>
            <Button color="inherit" component={Link} to="/">Inicio</Button>
            <Button color="inherit" component={Link} to="/album">Álbum</Button>
            <Button color="inherit" component={Link} to="/my-photos">Mis Fotos</Button>
            {/* <Button color="inherit" component={Link} to="/camera">Camara</Button> */}
            <Button color="inherit" component={Link} to="/logout">Cerrar Sesión</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );  
}

export default Index;