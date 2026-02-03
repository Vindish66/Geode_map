/* =========================
   ICÔNES
========================= */

const pinIcon = L.icon({
  iconUrl: "images/pin.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

function createAvatarIcon(url) {
  return L.divIcon({
    className: 'avatar-icon',
    html: `<div class="avatar-marker" style="background-image:url('${url}')"></div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48]
  });
}


/* =========================
   DIMENSIONS DE LA CARTE
========================= */

// Dimensions réelles de l'image
const IMAGE_WIDTH = 12288;
const IMAGE_HEIGHT = 5667;

// Conversion coordonnées fictives (0–100) → pixels
function convertX(x) {
  return (x / 100) * IMAGE_WIDTH;
}

function convertY(y) {
  return (y / 100) * IMAGE_HEIGHT;
}

// Conversion inverse (pixels → 0–100)
function inverseX(px) {
  return Math.round((px / IMAGE_WIDTH) * 100);
}

function inverseY(py) {
  return Math.round((py / IMAGE_HEIGHT) * 100);
}

/* =========================
   INITIALISATION LEAFLET
========================= */

const map = L.map("map", {
  crs: L.CRS.Simple,
  minZoom: -2,
  maxZoom: 2,
  zoomSnap: 0.25,
});

const bounds = [
  [0, 0],
  [IMAGE_HEIGHT, IMAGE_WIDTH],
];

L.imageOverlay("assets/map.jpeg", bounds).addTo(map);
map.fitBounds(bounds);

/* =========================
   DEBUG : CLIQUER POUR AVOIR
   LES COORDONNÉES NOTION
========================= */

map.on("click", (e) => {
  const x = inverseX(e.latlng.lng);
  const y = inverseY(e.latlng.lat);

  console.log("🗺️ Click carte");
  console.log("Pixels :", e.latlng);
  console.log("Coordonnées Notion :", { lat: y, lng: x });
});

marker.on("dragend", (e) => {
  const pos = e.target.getLatLng();
  const newLng = inverseX(pos.lng);
  const newLat = inverseY(pos.lat);

  marker.setPopupContent(`
    <strong>${lieu.nom}</strong><br>
    <em>Nouvelle position</em><br>
    Lat: ${newLat} | Lng: ${newLng}
  `).openPopup();

  console.log(`📍 ${lieu.nom}`, { lat: newLat, lng: newLng });
});


/* =========================
   CHARGEMENT DES LIEUX
========================= */

fetch("data/lieux.json")
  .then((res) => {
    if (!res.ok) throw new Error("Impossible de charger lieux.json");
    return res.json();
  })
  .then((lieux) => {
    console.log("📍 Lieux chargés :", lieux);

lieux.forEach(lieu => {
  if (lieu.lat == null || lieu.lng == null) return;

  const icon = lieu.avatar
    ? createAvatarIcon(lieu.avatar)
    : defaultIcon;

  const marker = L.marker([lieu.lat, lieu.lng], {
    icon,
    draggable: true
  }).addTo(map);

  marker.bindPopup(`<strong>${lieu.nom}</strong>`);

  marker.on("dragend", e => {
    const { lat, lng } = e.target.getLatLng();
    console.log(`${lieu.nom} déplacé →`, lat, lng);
  });
});

      // Debug déplacement
      marker.on("dragend", (e) => {
        const pos = e.target.getLatLng();
        const newLng = inverseX(pos.lng);
        const newLat = inverseY(pos.lat);

        console.log(`📍 ${lieu.nom}`);
        console.log(`Nouvelles coordonnées Notion : lat=${newLat}, lng=${newLng}`);
      });
    });
  })
  .catch((err) => {
    console.error("❌ Erreur chargement lieux :", err);
  });
