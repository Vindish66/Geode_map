console.log("map.js chargé");

// Création carte
const map = L.map("map", {
  crs: L.CRS.Simple,
  minZoom: -2
});

// Taille image
const width = 12288;
const height = 5667;

// Limites
const bounds = [[0, 0], [height, width]];

// Image
L.imageOverlay("assets/map.jpeg", bounds).addTo(map);
map.fitBounds(bounds);

// Marker test
L.marker([2000, 2000]).addTo(map).bindPopup("TEST");
