//src/components/videoRecorder/TimeDisplay.jsx
import React, { useEffect, useState } from 'react';
import { FaClock } from 'react-icons/fa';

const TimeDisplay = ({ isRecording }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval;

    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setSeconds(0);
    }

    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!isRecording) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <FaClock className="text-gray-500" />
      <span>
        Recording time:{' '}
        <span className="font-semibold">{formatTime(seconds)}</span>
      </span>
    </div>
  );
};

export default TimeDisplay;
