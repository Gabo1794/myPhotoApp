import React from "react";
import {Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { ServiceProvider } from "./context/ServiceContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Home from "./pages/Home/Index";
import Login from "./pages/Login/Index";
import Signup from "./pages/Signup/Index";
import Album from "./pages/Album/Index";
import MyPhotos from "./pages/MyPhotos/Index";
import PublicAlbum from "./pages/PublicViews/Album/Index";
import Camera from "./pages/PublicViews/Camera/Index";
import Navbar from "./components/Navbar/Index";
import PubNabar from "./components/Navbar/SharedNavbar/Index";
import { useAnonymousAuth } from "./hooks/useAnonymousAuth";
import { Box, CircularProgress } from "@mui/material";


const AppLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const PublicAppLayout = () => (
  <>
    <PubNabar />
    <Outlet />  
  </>
);

// Wrapper para rutas públicas que requieren autenticación anónima
const PublicRoutesWrapper = () => {
  const { loading } = useAnonymousAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PublicAppLayout />
  );
};


function App() {
  return (
    <ServiceProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/album" element={<Album />} />
          </Route>
        </Route>
        
        {/* Rutas públicas de invitados */}
        <Route element={<PublicRoutesWrapper />}>
          <Route path="/album/event/:aid" element={<PublicAlbum />} /> 
          <Route path="/my-photos/event/:aid" element={<MyPhotos />} />
          <Route path="/camera/:aid" element={<Camera />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ServiceProvider>
  );  
}

export default App;