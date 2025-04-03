//src/components/videoRecorder/VideoRecorder.jsx
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FaCircle, FaStop } from 'react-icons/fa';
import TimeDisplay from './TimeDisplay';
import { useToast } from '@/hooks/use-toast';
import { uploadVideoToSupabase } from '@/lib/supabase/uploadToSupabase';

const VideoRecorder = () => {
  const videoRef = useRef(null);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [previewStream, setPreviewStream] = useState(null);
  const timeoutRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(
          (device) => device.kind === 'videoinput'
        );
        setVideoDevices(videoInputs);
      } catch (err) {
        console.error('Error listing video devices:', err);
      }
    };

    getCameras();
  }, []);

  useEffect(() => {
    const getStream = async () => {
      if (!selectedDeviceId) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedDeviceId } },
          audio: true,
        });

        if (previewStream) {
          previewStream.getTracks().forEach((track) => track.stop());
        }

        setPreviewStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing selected camera:', err);
      }
    };

    getStream();

    return () => {
      if (previewStream) {
        previewStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [selectedDeviceId]);

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      video: true,
      blobPropertyBag: { type: 'video/mp4' },
      stream: previewStream,
    });

  const handleStartRecording = () => {
    startRecording();

    timeoutRef.current = setTimeout(() => {
      stopRecording();
      toast({
        title: 'Recording finished',
        description: 'Recording stopped automatically after 30 seconds.',
      });
    }, 30000);
  };

  const handleStopRecording = () => {
    stopRecording();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleUpload = async () => {
    const response = await fetch(mediaBlobUrl);
    const blob = await response.blob();
    const filename = `video-${Date.now()}.mp4`;

    try {
      const publicUrl = await uploadVideoToSupabase(blob, filename);
      toast({
        title: 'Video uploaded!',
        description: publicUrl,
      });
      console.log('URL del video:', publicUrl);
    } catch (err) {
      toast({
        title: 'Upload failed',
        description: err.message,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6">
      <Card className="w-full max-w-xl">
        <CardContent className="flex flex-col items-center gap-4 p-4">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-xl font-semibold">Video Record</h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {status}
              </Badge>
            </div>
          </div>

          {videoDevices.length > 0 && (
            <div className="w-full flex justify-end">
              <select
                className="border rounded-md p-1 text-sm"
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
              >
                <option value="">Choose a camera...</option>
                {videoDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${device.deviceId}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            muted
            className="rounded-lg border w-[500px] aspect-video bg-black"
          />

          <TimeDisplay isRecording={status === 'recording'} />

          <div className="flex gap-4">
            <Button
              onClick={handleStartRecording}
              variant="default"
              disabled={status === 'recording' || !previewStream}
              className="flex items-center gap-2"
            >
              {status === 'recording' ? (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
                </span>
              ) : (
                <FaCircle className="text-red-500" />
              )}
              Record
            </Button>

            <Button
              onClick={handleStopRecording}
              variant="destructive"
              disabled={status !== 'recording'}
              className="flex items-center gap-2"
            >
              <FaStop />
              Stop
            </Button>
          </div>
        </CardContent>
      </Card>

      {mediaBlobUrl && (
        <Card className="w-full max-w-xl">
          <CardContent className="flex flex-col items-center gap-4 p-4">
            <h3 className="text-lg font-medium">Recording Preview</h3>
            <video
              src={mediaBlobUrl}
              controls
              className="rounded-lg border w-[500px] aspect-video bg-black"
            />
            <a
              href={mediaBlobUrl}
              download="recording.mp4"
              className="text-blue-600 hover:underline"
            >
              Download Video
            </a>
            <Button onClick={handleUpload} disabled={!mediaBlobUrl}>
              Subir a Supabase
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VideoRecorder;
