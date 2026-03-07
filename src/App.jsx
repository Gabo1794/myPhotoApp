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
// import PublicMyPhotos from "./pages/PublicViews/MyPhotos/Index";
import Camera from "./pages/PublicViews/Camera/Index";
// import MyPhotos from "./components/MyPhotos/Index";
// import Camera from "./components/Camera/Index";
import Navbar from "./components/Navbar/Index";
import PubNabar from "./components/Navbar/SharedNavbar/Index";


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
        <Route element={<PublicAppLayout />}>
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
