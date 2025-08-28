const socket = io();
if ("geolocation" in navigator) {
  console.log("Geolocation is supported");
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    socket.emit("send-location", { latitude, longitude });
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  });
} else {
  console.log("Geolocation is not supported");
}
