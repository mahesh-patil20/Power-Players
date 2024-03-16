import React, { useEffect } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@mui/material';
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
      
      {stream ? <div style={{width: "45%", margin:"0 auto", padding:"1rem"}}><Webcam audio={false} ref={webcamRef} /> </div>: <p style={{textAlign: "center", margin:"10px"}}>Waiting for camera access...</p>}
      {capturing ? (
        <Button onClick={handleStopCaptureClick} style={{
          margin: "20px",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          backgroundColor: "#68e5ff",
          color: "black",
          fontWeight: "bold",
        
        }}>Stop Capture</Button>
      ) : (
        <Button onClick={handleStartCaptureClick} style={{
          margin: "20px",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          backgroundColor: "#68e5ff",
          color: "black",
          fontWeight: "bold",
        
        }}>Start Capture</Button>
      )}
      {recordedChunks.length > 0 && (
        <Button onClick={handleDownload} style={{
          margin: "20px",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          backgroundColor: "#68e5ff",
          color: "black",
          fontWeight: "bold",
        
        }}>Download</Button>
      )}
    </>
  );
};

export default Live;
