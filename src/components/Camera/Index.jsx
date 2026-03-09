import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMedia } from "../../hooks/useMedia";
import { useToast } from "../Toast";

const Index = ({ albumId }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();
  
  const [photo, setPhoto] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const [uploading, setUploading] = useState(false);

  const guestInfo = JSON.parse(localStorage.getItem("guestInfo"));
  const guestName = guestInfo?.guestName || "Guest";

  const { upload } = useMedia(albumId);

  useEffect(() => {
    let stream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Error al acceder a la cámara: ", err);
        toast.error("No se pudo acceder a la cámara");
      }
    };

    if (cameraActive) {
      startCamera();
    }

    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [cameraActive, facingMode, toast]);

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      setPhoto(canvas.toDataURL("image/png"));
    }
  };

  const uploadPhoto = async () => {
    if (!photo) return;

    try {
      setUploading(true);
      const response = await fetch(photo);
      const blob = await response.blob();

      const file = new File([blob], `photo-${Date.now()}.png`, {
        type: "image/png",
      });

      await upload(file, guestName);

      setPhoto(null);
      toast.success("Foto subida con éxito");
      
      // Regresar al álbum después de subir
      setTimeout(() => {
        navigate(`/album/event/${albumId}`);
      }, 1500);
    } catch (err) {
      console.error("Error al subir la foto:", err);
      toast.error("Error al subir la foto");
    } finally {
      setUploading(false);
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
    setCameraActive(false);
    setTimeout(() => setCameraActive(true), 500);
  };

  const discardPhoto = () => {
    setPhoto(null);
  };

  return (
    <div className="min-h-screen bg-surface-light pb-24">
      {/* Header */}
      <div className="bg-white border-b border-surface-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(`/album/event/${albumId}`)}
            className="flex items-center gap-2 text-accent font-medium hover:opacity-80 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
          <h1 className="text-lg font-semibold text-text-primary">Tomar Foto</h1>
          <div className="w-12"></div>
        </div>
      </div>

      {/* Camera View */}
      <div className="flex flex-col items-center justify-center">
        {!cameraActive && !photo && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setCameraActive(true)}
              className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:opacity-90 transition-all"
            >
              Iniciar Cámara
            </button>
          </div>
        )}

        {cameraActive && !photo && (
          <div className="w-full max-w-2xl mx-auto mt-4 px-4">
            <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            <canvas ref={canvasRef} style={{ display: "none" }} />

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={takePhoto}
                className="flex items-center justify-center w-16 h-16 rounded-full bg-accent text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-110 active:scale-95"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              <button
                onClick={toggleCamera}
                className="flex items-center justify-center w-14 h-14 rounded-full bg-surface-dark text-text-primary shadow-lg hover:shadow-xl transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12M8 7a2 2 0 010-4h12a2 2 0 010 4m0 0a2 2 0 100 4H8a2 2 0 100-4" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {photo && (
          <div className="w-full max-w-2xl mx-auto mt-4 px-4">
            <div className="rounded-xl overflow-hidden">
              <img src={photo} alt="Foto capturada" className="w-full h-auto" />
            </div>

            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={uploadPhoto}
                disabled={uploading}
                className={`px-6 py-3 bg-accent text-white rounded-lg font-medium transition-all ${
                  uploading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                }`}
              >
                {uploading ? 'Subiendo...' : 'Subir Foto'}
              </button>
              <button
                onClick={discardPhoto}
                disabled={uploading}
                className="px-6 py-3 border border-error text-error rounded-lg font-medium hover:bg-error hover:text-white transition-all disabled:opacity-50"
              >
                Descartar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
