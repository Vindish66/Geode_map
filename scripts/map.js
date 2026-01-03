const pinIcon = L.icon({
  iconUrl: 'images/pin.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Dimensions réelles de ton image (IMPORTANT)
const imageWidth = 12288;
const imageHeight = 5667;

const MAP_WIDTH = 12288;
const MAP_HEIGHT = 5776;

function convertX(x) {
  return (x / 100) * MAP_WIDTH;
}

function convertY(y) {
  return (y / 100) * MAP_HEIGHT;
}

function inverseX(x) {
  return Math.round((x / MAP_WIDTH) * 100);
}

function inverseY(y) {
  return Math.round((y / MAP_HEIGHT) * 100);
}

// Création de la carte avec un système de coordonnées simple
const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -2,
  maxZoom: 2,
  zoomSnap: 0.25
});

// Définition des limites de la carte
const bounds = [
  [0, 0],
  [imageHeight, imageWidth]
];

// Ajout de l'image comme fond de carte
L.imageOverlay('assets/map.jpeg', bounds).addTo(map);

// Ajuster la vue à l'image
map.fitBounds(bounds);

function createAvatarIcon(url) {
  return L.divIcon({
    className: '',
    html: `<div class="avatar-marker" style="background-image: url('${url}')"></div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48]
  });
}

function createMarker(lieu) {

  const icon = lieu.avatar
  ? createAvatarIcon(lieu.avatar)
  : L.icon({
      iconUrl: `images/${lieu.type}.png`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });

  const marker = L.marker(
    [convertY(lieu.y), convertX(lieu.x)],
   {
     icon,
     draggable: true
    }
  ).addTo(map);

  marker.bindPopup(`
  <strong>${lieu.nom}</strong><br>
  ${lieu.description}<br>
  <em>X: ${lieu.x} | Y: ${lieu.y}</em><br>
  <a href="${lieu.lien}" target="_blank">Voir la fiche</a>
  `);


  marker.on('dragend', function (e) {
    const pos = e.target.getLatLng();

    const newX = inverseX(pos.lng);
    const newY = inverseY(pos.lat);

    console.log(`📍 ${lieu.nom}`);
    console.log(`X: ${newX} | Y: ${newY}`);
  });
}

fetch('data/lieux.json')
  .then(res => res.json())
  .then(lieux => {
    lieux.forEach(lieu => {
      createMarker(lieu);
    });
  });
