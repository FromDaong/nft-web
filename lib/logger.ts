export default function logger(data) {
  // Log name of function that called logger and the filename
  console.log(`${new Date().toLocaleString()} \n \n ${data}`);
}
