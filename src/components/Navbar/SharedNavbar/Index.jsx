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
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import ModalUserInvited from "../../UserInvited/Index";

const Index = () => {
  const theme = useTheme();
  const { aid } = useParams();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if the viewport width is small
  const [anchorEl, setAnchorEl] = useState(null);
  const [eventName, setEventName] = useState("");

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        // Referenciar el documento en la colección 'albums'
        const albumRef = doc(db, "albums", aid);

        // Obtener el documento
        const albumSnap = await getDoc(albumRef);

        if (albumSnap.exists()) {
          // El documento fue encontrado, puedes acceder a sus datos
          const albumData = albumSnap.data();
          setEventName(albumData.title);
        } else {
          // El documento no existe
          console.log("No existe un álbum con ese ID");
          setEventName(null);
        }
      } catch (error) {
        console.error("Error al obtener el álbum:", error);
        setEventName(null);
      }
    };
    fetchAlbum();
  }, [eventName]);

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
                <MenuItem
                  component={Link}
                  to={`/camera/${aid}`}
                  onClick={handleMenuClose}
                >
                  Cámara
                </MenuItem>
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
              <Button color="inherit" component={Link} to={`/camera/${aid}`}>
                Camara
              </Button>
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
