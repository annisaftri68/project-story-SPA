export default function sleep(ms = 800) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
