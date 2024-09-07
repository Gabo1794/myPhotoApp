import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Snackbar
} from "@mui/material";
import { Edit, Delete, Visibility, ContentCopy } from "@mui/icons-material";

const AlbumTable = ({ onEdit, onView }) => {
  const [albums, setAlbums] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchAlbums = async () => {
      const albumCollection = collection(db, "albums");
      const albumSnapshot = await getDocs(albumCollection);
      const albumList = albumSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAlbums(albumList);
    };

    fetchAlbums();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "albums", id));
    setAlbums(albums.filter((album) => album.id !== id));
  };

  const handleCopyLink = (id) => {
    
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/album/event/${id}`;

    navigator.clipboard.writeText(link)
      .then(() => {
        setOpenSnackbar(true);
      })
      .catch(err => {
        console.error('Error al copiar el enlace:', err);
      });
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {albums.map((album) => (
              <TableRow key={album.id}>
                <TableCell component="th" scope="row">
                  {album.title}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton onClick={() => onEdit(album)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => handleDelete(album.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Ver">
                    <IconButton onClick={() => onView(album)}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Copiar link">
                    <IconButton onClick={() => handleCopyLink(album.id)}>
                      <ContentCopy />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Enlace copiado al portapapeles"
      />
    </>
  );
};

export default AlbumTable;
