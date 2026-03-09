import React from "react";
import {Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { ServiceProvider } from "./context/ServiceContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ToastProvider } from "./components/Toast";
import LandingPage from "./pages/Landing/Index";
import Home from "./pages/Home/Index";
import Login from "./pages/Login/Index";
import Signup from "./pages/Signup/Index";
import Album from "./pages/Album/Index";
import MyPhotos from "./pages/MyPhotos/Index";
import PublicAlbum from "./pages/PublicViews/Album/Index";
import Camera from "./pages/PublicViews/Camera/Index";
import Navbar from "./components/Navbar/Index";
import PublicNavbar from "./components/Navbar/PublicNavbar";
import { useAnonymousAuth } from "./hooks/useAnonymousAuth";


const AppLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const PublicAppLayout = () => (
  <>
    <PublicNavbar />
    <Outlet />  
  </>
);

// Wrapper for public routes that require anonymous auth
const PublicRoutesWrapper = () => {
  const { loading } = useAnonymousAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-surface-light">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
      </div>
    );
  }

  return (
    <PublicAppLayout />
  );
};


function App() {
  return (
    <ToastProvider>
      <ServiceProvider>
        <Routes>
          {/* Landing/Marketing Pages */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes - Authenticated Users */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/album" element={<Album />} />
            </Route>
          </Route>
          
          {/* Public Routes - Guest Access */}
          <Route element={<PublicRoutesWrapper />}>
            <Route path="/album/event/:aid" element={<PublicAlbum />} /> 
            <Route path="/my-photos/event/:aid" element={<MyPhotos />} />
            <Route path="/camera/:aid" element={<Camera />} />
          </Route>

          {/* Fallback - Redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ServiceProvider>
    </ToastProvider>
  );  
}

export default App;