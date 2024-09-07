// import React, { useEffect, useState } from 'react';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '../../config/firebase';

// const Index = () => {
//   const [photos, setPhotos] = useState([]);

//   useEffect(() => {
//     const fetchPhotos = async () => {
//       const photosSnapshot = await getDocs(collection(db, 'photos'));
//       setPhotos(photosSnapshot.docs.map(doc => doc.data()));
//     };

//     fetchPhotos();
//   }, []);

//   return (
//     <div>
//       <h1>Album</h1>
//       <div>
//         {photos.map((photo, index) => (
//           <img key={index} src={photo.url} alt="user-upload" />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Index;


// import React, { useState, useEffect } from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button } from '@mui/material';
// import { Edit, Delete, Visibility } from '@mui/icons-material';
// import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
// import { db } from '../../config/firebase';
// import AddAlbumDialog from './AddAlbumDialog';
// import EditAlbumDialog from './EditAlbumDialog';

// function Index() {
//   const [albums, setAlbums] = useState([]);
//   const [openAddDialog, setOpenAddDialog] = useState(false);
//   const [openEditDialog, setOpenEditDialog] = useState(false);
//   const [currentAlbum, setCurrentAlbum] = useState(null);

//   useEffect(() => {
//     const fetchAlbums = async () => {
//       const albumsCollection = await getDocs(collection(db, 'albums'));
//       setAlbums(albumsCollection.docs.map(doc => ({ ...doc.data(), id: doc.id })));
//     };

//     fetchAlbums();
//   }, []);

//   const handleDelete = async (id) => {
//     await deleteDoc(doc(db, 'albums', id));
//     setAlbums(albums.filter(album => album.id !== id));
//   };

//   const handleOpenEditDialog = (album) => {
//     setCurrentAlbum(album);
//     setOpenEditDialog(true);
//   };

//   return (
//     <div>
//       <Button variant="contained" color="primary" onClick={() => setOpenAddDialog(true)}>Crear Álbum</Button>
//       <TableContainer component={Paper} style={{ marginTop: '20px' }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Título</TableCell>
//               <TableCell align="right">Acciones</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {albums.map(album => (
//               <TableRow key={album.id}>
//                 <TableCell>{album.title}</TableCell>
//                 <TableCell align="right">
//                   <IconButton onClick={() => handleOpenEditDialog(album)}>
//                     <Edit />
//                   </IconButton>
//                   <IconButton onClick={() => handleDelete(album.id)}>
//                     <Delete />
//                   </IconButton>
//                   <IconButton>
//                     <Visibility />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <AddAlbumDialog open={openAddDialog} handleClose={() => setOpenAddDialog(false)} />
//       {currentAlbum && <EditAlbumDialog album={currentAlbum} open={openEditDialog} handleClose={() => setOpenEditDialog(false)} />}
//     </div>
//   );
// }

// export default Index;



import React, { useState } from 'react';
import AlbumTable from './AlbumTable';
import AlbumForm from './AlbumForm';
import AlbumView from './AlbumView';
import { Container, Typography, Button } from '@mui/material';

const Index = () => {
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [viewingAlbum, setViewingAlbum] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);

  const handleEdit = (album) => {
    setCurrentAlbum(album);
    setFormVisible(true);
  };

  const handleView = (album) => {
    setViewingAlbum(album);
  };

  const handleSave = () => {
    setFormVisible(false);
    setCurrentAlbum(null);
  };

  const handleCancel = () => {
    setFormVisible(false);
    setCurrentAlbum(null);
  };

  const handleBack = () => {
    setViewingAlbum(null);
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>Gestor de Álbumes</Typography>
      {isFormVisible ? (
        <AlbumForm currentAlbum={currentAlbum} onSave={handleSave} onCancel={handleCancel} />
      ) : viewingAlbum ? (
        <AlbumView album={viewingAlbum} onBack={handleBack} />
      ) : (
        <>
          <Button variant="contained" color="primary" onClick={() => setFormVisible(true)} sx={{ mb: 2 }}>
            Crear Nuevo Álbum
          </Button>
          <AlbumTable onEdit={handleEdit} onView={handleView} />
        </>
      )}
    </Container>
  );
};//http://localhost:5173/album/event/qi2X6U8LCr6Gt3nBM4Qj

export default Index;
