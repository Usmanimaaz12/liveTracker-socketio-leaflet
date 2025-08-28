const socket = io();
if ("geolocation" in navigator) {
  console.log("Geolocation is supported");
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    },
    (error) => {
      console.error("Error getting location:", error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );
} else {
  console.log("Geolocation is not supported");
}

const markers = {};
const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Maaz Usmani",
}).addTo(map);

socket.on("new-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude], 16);
  if (!markers[id]) {
    const marker = L.marker([latitude, longitude]).addTo(map);
    markers[id] = marker;
  } else {
    markers[id].setLatLng([latitude, longitude]);
  }
});

socket.on("user-disconnected", (data) => {
  const { id } = data;
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
