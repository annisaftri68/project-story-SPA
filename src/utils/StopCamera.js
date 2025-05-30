export default function stopCamera(videoElement) {
  const stream = videoElement?._streamRef;
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    videoElement.srcObject = null;
  }
}
