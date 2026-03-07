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
import { Link, useParams } from "react-router-dom";
import ModalUserInvited from "../../UserInvited/Index";
import { useAlbums } from "../../../hooks/useAlbums";

const Index = () => {
  const theme = useTheme();
  const { aid } = useParams();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [eventName, setEventName] = useState("");

  const { getById } = useAlbums();

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const albumData = await getById(aid);
        if (albumData) {
          setEventName(albumData.name);
        } else {
          console.log("No existe un álbum con ese ID");
          setEventName(null);
        }
      } catch (error) {
        console.error("Error al obtener el álbum:", error);
        setEventName(null);
      }
    };
    if (aid) {
      fetchAlbum();
    }
  }, [aid, getById]);

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
                {/* <MenuItem
                  component={Link}
                  to={`/camera/${aid}`}
                  onClick={handleMenuClose}
                >
                  Cámara
                </MenuItem> */}
                {/* <MenuItem component={Link} to="/logout" onClick={handleMenuClose}>
                Cerrar Sesión
              </MenuItem> */}
              </Menu>
            </>
          ) : (
            <>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {eventName}
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
              {/* <Button color="inherit" component={Link} to={`/camera/${aid}`}>
                Camara
              </Button> */}
              {/* <Button color="inherit" component={Link} to="/logout">
              Cerrar Sesión
            </Button> */}
            </>
          )}
        </Toolbar>
      </AppBar>

      <ModalUserInvited albumId={aid} />
    </>
  );
};

export default Index;
