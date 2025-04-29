// src/components/videoRecorder/VideoRecorderIDrive.jsx
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import axios from 'axios'; // <--- Importar axios
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FaCircle, FaStop, FaSpinner } from 'react-icons/fa';
import TimeDisplay from './TimeDisplay'; // Asegúrate que la ruta sea correcta
import { useToast } from '@/hooks/use-toast'; // Asegúrate que la ruta sea correcta
import {
  MdCloudUpload,
  MdCloudDownload,
  // MdOutlineAddLink, // Ya no generamos link aquí
} from 'react-icons/md';
// import { uploadVideoToSupabase } from '@/lib/supabase/uploadToSupabase'; // No se usa Supabase aquí
// import useCompanyTheme from '@/store/useCompanyTheme'; // No se usa el tema aquí

// URL del endpoint de iDrive
const IDRIVE_UPLOAD_URL =
  'https://api.nevtis.com/marketplace/files/video/upload';

const VideoRecorderIDrive = () => {
  // Estado para almacenar la respuesta (o la clave) de iDrive
  const [uploadResultKey, setUploadResultKey] = useState('');
  const videoRef = useRef(null);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [previewStream, setPreviewStream] = useState(null);
  const timeoutRef = useRef(null);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  // --- Lógica de permisos y cámaras (Sin cambios respecto al original) ---
  useEffect(() => {
    const requestPermissionsAndGetCameras = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(
          (device) => device.kind === 'videoinput'
        );
        setVideoDevices(videoInputs);
        // if (videoInputs.length > 0 && !selectedDeviceId) {
        //   setSelectedDeviceId(videoInputs[0].deviceId);
        // }
      } catch (err) {
        console.error('Error accessing media devices:', err);
        toast({
          title: 'Error de Permisos',
          description: 'No se pudo acceder a la cámara/micrófono.',
          variant: 'destructive',
        });
      }
    };
    requestPermissionsAndGetCameras();
  }, [toast, selectedDeviceId]); // Incluir selectedDeviceId si se habilita la selección por defecto

  useEffect(() => {
    return () => {
      if (previewStream) {
        previewStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [previewStream]);

  useEffect(() => {
    let isMounted = true;
    const getStream = async () => {
      if (!selectedDeviceId) {
        /* ... limpiar stream ... */ return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedDeviceId } },
          audio: true,
        });
        if (isMounted) {
          setPreviewStream((prev) => {
            /* ... detener prev ... */ return stream;
          });
          if (videoRef.current) videoRef.current.srcObject = stream;
        } else {
          stream.getTracks().forEach((track) => track.stop());
        }
      } catch (err) {
        console.error(
          'Error accessing selected camera:',
          err
        ); /* ... toast ... */
      }
    };
    getStream();
    return () => {
      isMounted = false;
    };
  }, [selectedDeviceId, toast]);

  // --- Hook de grabación (Sin cambios) ---
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl,
    previewStream: recorderPreviewStream,
  } = useReactMediaRecorder({
    video: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true,
    audio: true,
    blobPropertyBag: { type: 'video/mp4' },
  });

  // --- Sincronizar video element (Sin cambios) ---
  useEffect(() => {
    if (videoRef.current) {
      if (status === 'recording' && recorderPreviewStream)
        videoRef.current.srcObject = recorderPreviewStream;
      else if (status !== 'recording' && previewStream)
        videoRef.current.srcObject = previewStream;
      else videoRef.current.srcObject = null;
    }
  }, [previewStream, status, recorderPreviewStream]);

  // --- Lógica de grabación (Sin cambios) ---
  const handleStartRecording = () => {
    if (!selectedDeviceId && videoDevices.length > 0) {
      /* ... toast ... */ return;
    }
    if (!previewStream && selectedDeviceId) {
      /* ... toast ... */ return;
    }
    clearBlobUrl();
    setUploadResultKey(''); // Limpiar resultado anterior
    startRecording();
    // timeoutRef.current = setTimeout(() => { /* ... */ }, 30000);
  };

  const handleStopRecording = () => {
    stopRecording();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // --- Lógica de Subida MODIFICADA para iDrive con Axios ---
  const handleUpload = async () => {
    if (!mediaBlobUrl) {
      toast({
        title: 'Error',
        description: 'No hay video grabado para subir.',
      });
      return;
    }

    setIsUploading(true);
    setUploadResultKey('');
    console.log('Starting iDrive upload process...');

    try {
      // 1. Obtener el Blob desde la URL local
      const response = await fetch(mediaBlobUrl);
      if (!response.ok)
        throw new Error(`Failed to fetch blob: ${response.statusText}`);
      const blob = await response.blob();
      console.log('Blob obtained for iDrive upload, size:', blob.size);

      // 2. Crear FormData
      const formData = new FormData();
      // Usar 'file' como key (según tu prueba en Postman)
      // Darle un nombre de archivo al Blob
      formData.append('file', blob, `idrive-video-${Date.now()}.mp4`);
      console.log('FormData created for iDrive.');

      // 3. Enviar a iDrive usando axios.post
      console.log(`Uploading video to iDrive: ${IDRIVE_UPLOAD_URL}`);
      const axiosResponse = await axios.post(IDRIVE_UPLOAD_URL, formData, {
        // Axios establece automáticamente 'Content-Type': 'multipart/form-data'
        // No se necesitan headers adicionales según tu prueba
        // timeout: 60000, // Opcional: timeout de 60 segundos
      });

      // 4. Manejar la respuesta exitosa de iDrive
      console.log('iDrive Upload successful:', axiosResponse.data);
      const result = axiosResponse.data; // { message, key }

      toast({
        title: '¡Subido a iDrive!',
        description: result.message || `Key: ${result.key}`, // Mostrar mensaje o key
      });

      // Guardar la clave (key) en el estado para mostrarla
      if (result.key) {
        setUploadResultKey(result.key);
      } else {
        // Si no hay key, mostrar el mensaje completo como referencia
        setUploadResultKey(
          result.message || "Subida exitosa, pero no se recibió 'key'."
        );
      }
    } catch (err) {
      // Manejo de errores (similar al anterior, adaptado para iDrive)
      console.error('iDrive Upload failed:', err);
      let errorMessage = 'Ocurrió un error al subir el video a iDrive.';
      if (axios.isAxiosError(err)) {
        if (err.response) {
          errorMessage = `Error del servidor iDrive (${err.response.status}): ${
            err.response.data?.message || err.message
          }`;
          console.error('iDrive Server Error Data:', err.response.data);
        } else if (err.request) {
          errorMessage = 'Error de red al contactar iDrive.';
          console.error('iDrive Network Error:', err.request);
        } else {
          errorMessage = `Error de configuración Axios: ${err.message}`;
        }
      } else {
        errorMessage = `Error inesperado: ${err.message}`;
      }
      toast({
        title: 'Fallo la Subida a iDrive',
        description: errorMessage,
        variant: 'destructive',
      });
      setUploadResultKey(''); // Limpiar en caso de error
    } finally {
      setIsUploading(false);
      console.log('iDrive upload process finished.');
    }
  };

  // --- Renderizado del Componente (Ajustado para mostrar la key/respuesta) ---
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6">
      {/* Card para la grabación (Sin cambios funcionales) */}
      <Card className="w-full max-w-xl shadow-md rounded-lg">
        <CardContent className="flex flex-col items-center gap-4 p-4">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-xl font-semibold text-gray-800">
              Video Recorder (iDrive)
            </h2>{' '}
            {/* Título cambiado */}
            <div className="flex items-center gap-2">
              {' '}
              <Badge
                variant={status === 'recording' ? 'destructive' : 'outline'}
                className="capitalize text-sm px-2.5 py-0.5 rounded-full"
              >
                {status}
              </Badge>{' '}
            </div>
          </div>
          {videoDevices.length > 0 && (
            <div className="w-full flex justify-end items-center gap-2 mt-2">
              <label
                htmlFor="camera-select-idrive"
                className="text-sm font-medium text-gray-600"
              >
                Cámara:
              </label>
              <select
                id="camera-select-idrive"
                className="border border-gray-300 rounded-md p-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                disabled={status === 'recording' || isUploading}
              >
                <option value="">Elegir cámara...</option>
                {videoDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {' '}
                    {device.label ||
                      `Cámara ${device.deviceId.substring(0, 8)}...`}{' '}
                  </option>
                ))}
              </select>
            </div>
          )}
          {videoDevices.length === 0 && status !== 'idle' && (
            <p className="text-xs text-red-600 mt-1">
              No se encontraron cámaras o faltan permisos.
            </p>
          )}
          <div className="w-full max-w-[500px] aspect-video bg-black rounded-md border border-gray-200 overflow-hidden mt-2">
            {' '}
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />{' '}
          </div>
          <div className="h-6 mt-2">
            {' '}
            <TimeDisplay isRecording={status === 'recording'} />{' '}
          </div>
          <div className="flex gap-4 mt-2">
            <Button
              onClick={handleStartRecording}
              variant="default"
              disabled={
                status === 'recording' ||
                (!selectedDeviceId && videoDevices.length > 0) ||
                isUploading
              }
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50"
            >
              {' '}
              {status === 'recording' ? (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                </span>
              ) : (
                <FaCircle className="text-red-500" />
              )}{' '}
              Record{' '}
            </Button>
            <Button
              onClick={handleStopRecording}
              variant="destructive"
              disabled={status !== 'recording' || isUploading}
              className="flex items-center gap-2 px-4 py-2 rounded-md disabled:opacity-50"
            >
              {' '}
              <FaStop /> Stop{' '}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Card para Preview y Subida (Ajustado) */}
      {mediaBlobUrl && status === 'stopped' && (
        <Card className="w-full max-w-xl mt-4 shadow-md rounded-lg">
          <CardContent className="flex flex-col items-center gap-4 p-4">
            <h3 className="text-lg font-medium self-start text-gray-700">
              Recording Preview
            </h3>
            <div className="w-full max-w-[500px] aspect-video bg-black rounded-md border border-gray-200 overflow-hidden">
              {' '}
              <video
                src={mediaBlobUrl}
                controls
                className="w-full h-full object-cover"
              />{' '}
            </div>
            {/* Botones de Acción */}
            <div className="flex flex-row justify-center gap-4 w-full mt-2">
              {/* Botón Descargar (igual) */}
              <a
                href={mediaBlobUrl}
                download={`grabacion-${Date.now()}.mp4`}
                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
                style={{
                  pointerEvents: isUploading ? 'none' : 'auto',
                  opacity: isUploading ? 0.5 : 1,
                }}
              >
                {' '}
                <MdCloudDownload className="inline-block mr-1" /> Download{' '}
              </a>
              {/* Botón Subir (llama a la nueva función handleUpload) */}
              <Button
                onClick={handleUpload}
                disabled={!mediaBlobUrl || isUploading}
                className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md disabled:opacity-50 disabled:bg-purple-300"
              >
                {' '}
                {/* Color cambiado para diferenciar */}
                {isUploading ? (
                  <FaSpinner className="animate-spin mr-1" />
                ) : (
                  <MdCloudUpload className="inline-block mr-1" />
                )}
                {isUploading ? 'Uploading to iDrive...' : 'Upload to iDrive'}{' '}
                {/* Texto cambiado */}
              </Button>
            </div>
            {/* Mostrar la respuesta/key de iDrive */}
            {uploadResultKey && !isUploading && (
              <div className="flex flex-col items-start gap-1 mt-4 w-full px-2 bg-gray-100 p-3 rounded-md border border-gray-200">
                <label
                  htmlFor="idrive-response-output"
                  className="text-sm font-medium text-gray-600"
                >
                  iDrive Upload Key:
                </label>
                <input
                  id="idrive-response-output"
                  type="text"
                  readOnly
                  value={uploadResultKey} // Mostrar la key guardada
                  className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white focus:outline-none"
                  onClick={(e) => e.target.select()}
                />
                <Button
                  variant="link" // Estilo de link para copiar
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(uploadResultKey);
                    toast({
                      title: 'Key Copiada',
                      description: 'La clave de iDrive se ha copiado.',
                    });
                  }}
                  className="text-blue-600 hover:underline p-0 h-auto mt-1 self-end" // Estilo y alineación
                >
                  Copiar Key
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VideoRecorderIDrive;
