/* =========================
   ICÔNES
========================= */

const pinIcon = L.icon({
  iconUrl: "images/pin.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
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

    lieux.forEach((lieu) => {
      if (lieu.lat == null || lieu.lng == null) return;

      // Conversion Notion → pixels
      const pxX = convertX(lieu.lng);
      const pxY = convertY(lieu.lat);

      const marker = L.marker(
        [pxY, pxX],
        {
          icon: lieu.avatar
            ? createAvatarIcon(lieu.avatar)
            : pinIcon,
          draggable: true,
        }
      ).addTo(map);

      marker.bindPopup(`
        <strong>${lieu.nom ?? "Lieu sans nom"}</strong><br>
        ${lieu.avatar ? `<img src="${lieu.avatar}" width="120"><br>` : ""}
        <em>Lat: ${lieu.lat} | Lng: ${lieu.lng}</em>
      `);

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
