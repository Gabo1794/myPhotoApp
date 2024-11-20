import React, { useState } from "react";
import {
  Grid2 as Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

const Index = ({ images, handleDeleteImage }) => {
  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const handleOpen = (media) => {
    setSelectedMedia(media);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMedia(null);
  };

  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        {images.map((media, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card>
              {media.contentType.startsWith("video/") ? (
                <Box
                  component="video"
                  src={media.url}
                  controls
                  preload="auto"
                  playsInline
                  height="200"
                  sx={{
                    cursor: "pointer",
                    objectFit: "cover",
                    width: "100%",
                  }}
                >
                  Tu navegador no soporta la etiqueta de video.
                </Box>
              ) : (
                <CardMedia
                  component="img"
                  alt={`image-${index}`}
                  height="200"
                  image={media.url}
                  onClick={() => handleOpen(media)}
                  sx={{ cursor: "pointer", objectFit: "cover" }}
                />
              )}
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Recuerdo {index + 1}
                  </Typography>
                  {handleDeleteImage && (
                  <IconButton
                    onClick={() => handleDeleteImage(media.url)}
                    aria-label="delete"
                    sx={{ color: "error.main" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                   )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              bgcolor: "background.default",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                color: "white",
                backgroundColor: "rgba(0,0,0,0.6)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
              }}
            >
              <CloseIcon />
            </IconButton>

            {selectedMedia &&
              (selectedMedia.contentType.startsWith("video/") ? (
                <video
                  src={selectedMedia.url}
                  controls
                  style={{ width: "100%", height: "auto" }}
                />
              ) : (
                <img
                  src={selectedMedia.url}
                  alt="Selected"
                  style={{ width: "100%", height: "auto" }}
                />
              ))}
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default Index;
