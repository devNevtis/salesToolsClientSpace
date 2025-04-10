//src/app/main/video-rec/page.jsx
import VideoRecorder from '@/components/videoRecorder/VideoRecorder';
import React from 'react';

const page = () => {
  return (
    <div className="h-[90vh] overflow-y-auto">
      <VideoRecorder />
    </div>
  );
};

export default page;
