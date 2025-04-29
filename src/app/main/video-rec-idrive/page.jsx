// src/app/main/video-rec-idrive/page.jsx
import VideoRecorderIDrive from '@/components/videoRecorder/VideoRecorderIDrive'; // Importa el nuevo
import React from 'react';

const page = () => {
  return (
    <div className="h-[90vh] overflow-y-auto">
      <VideoRecorderIDrive /> {/* Usa el nuevo componente */}
    </div>
  );
};
export default page;
