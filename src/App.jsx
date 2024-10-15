import React from "react";
import {Route, Routes, Navigate, Outlet } from 'react-router-dom';
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

    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/album" element={<Album />} />
        <Route path="/logout" element={<Navigate to="/login" replace />} />
      </Route>
      
      {/* paginas publicas para la app qi2X6U8LCr6Gt3nBM4Qj */}
      
      <Route element={<PublicAppLayout />}>
        <Route path="/album/event/:aid" element={ <PublicAlbum /> } /> 
        <Route path="/my-photos/event/:aid" element={ <MyPhotos />} />
        <Route path="/camera/:aid" element={<Camera />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );  
}

export default App;
