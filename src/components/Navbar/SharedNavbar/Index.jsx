import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useParams, useLocation } from "react-router-dom";
import ModalUserInvited from "../../UserInvited/Index";

const Index = () => {
  const theme = useTheme();
  const { aid } = useParams();
  const location = useLocation();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [eventName, setEventName] = useState("");

  // No usar hooks que requieren contexto en rutas de camera
  const isCamera = location.pathname.includes('/camera');

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
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
                <MenuItem
                  component={Link}
                  to={`/album/event/${aid}`}
                  onClick={handleMenuClose}
                >
                  Álbum
                </MenuItem>
                <MenuItem
                  component={Link}
                  to={`/my-photos/event/${aid}`}
                  onClick={handleMenuClose}
                >
                  Mis Fotos
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {eventName || "Evento"}
              </Typography>
              <Button
                color="inherit"
                component={Link}
                to={`/album/event/${aid}`}
              >
                Álbum
              </Button>
              <Button
                color="inherit"
                component={Link}
                to={`/my-photos/event/${aid}`}
              >
                Mis Fotos
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {!isCamera && <ModalUserInvited albumId={aid} />}
    </>
  );
};

export default Index;