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

  const handleOpen = (url) => {
    setSelectedMedia(url);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMedia(null);
  };

  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        {images.map((url, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card>
              <CardMedia
                component="img"
                alt={`image-${index}`}
                height="200"
                image={url}
                onClick={() => handleOpen(url)}
                sx={{ cursor: "pointer", objectFit: "cover" }}
              />
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
                    Foto {index + 1}
                  </Typography>
                  {handleDeleteImage && (
                    <IconButton
                      onClick={() => handleDeleteImage(url)}
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
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 2,
              maxWidth: "90vw",
              maxHeight: "90vh",
              outline: "none",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius:2
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
              (selectedMedia.includes(".mp4") ? (
                <video
                  src={selectedMedia}
                  controls
                  style={{
                    width: "100%",
                    maxHeight: "80vh",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <img
                  src={selectedMedia}
                  alt="Selected"
                  style={{
                    width: "100%",
                    maxHeight: "80vh",
                    objectFit: "contain",
                  }}
                />
              ))}
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default Index;
