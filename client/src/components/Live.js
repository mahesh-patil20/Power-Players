import React, { useEffect } from 'react';
import Webcam from 'react-webcam';

const Live = () => {
  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  const [stream, setStream] = React.useState(null);

  useEffect(() => {
    localStorage.setItem('systemSecurity', false);
  }, []);

  const handleStartCaptureClick = React.useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    setStream(stream);
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: 'video/webm'
    });
    mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable);
    mediaRecorderRef.current.start();
  }, []);

  const handleDataAvailable = React.useCallback(({ data }) => {
    if (data.size > 0) {
      setRecordedChunks((prev) => prev.concat(data));
    }
  }, []);

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    stream.getTracks().forEach(track => track.stop());
    setCapturing(false);
  }, [stream]);

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      a.href = url;
      a.download = 'react-webcam-stream-capture.webm';
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  return (
    <>
      {stream ? <Webcam audio={false} ref={webcamRef} /> : <p>Waiting for camera access...</p>}
      {capturing ? (
        <button onClick={handleStopCaptureClick}>Stop Capture</button>
      ) : (
        <button onClick={handleStartCaptureClick}>Start Capture</button>
      )}
      {recordedChunks.length > 0 && (
        <button onClick={handleDownload}>Download</button>
      )}
    </>
  );
};

export default Live;
