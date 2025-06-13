export default async function StartCamera(videoEl) {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  videoEl.srcObject = stream;
  videoEl._streamRef = stream;
  await videoEl.play();
}
