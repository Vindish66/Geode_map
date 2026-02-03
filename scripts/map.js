// ================= ICONES =================
const pinIcon = L.icon({
  iconUrl: "images/pin.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

function createAvatarIcon(url) {
  return L.divIcon({
    html: `
      <div style="
        width:48px;
        height:48px;
        border-radius:50%;
        background-image:url('${url}');
        background-size:cover;
        background-position:center;
        border:2px solid white;
      "></div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    className: ""
  });
}

// ================= CARTE =================
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

const map = L.map("map", {
  crs: L.CRS.Simple,
  minZoom: -2,
  maxZoom: 2,
  zoomSnap: 0.25
});

const bounds = [[0, 0], [MAP_HEIGHT, MAP_WIDTH]];
L.imageOverlay("assets/map.jpeg", bounds).addTo(map);
map.fitBounds(bounds);

// ================= CLICK =================
map.on("click", e => {
  const x = inverseX(e.latlng.lng);
  const y = inverseY(e.latlng.lat);
  console.log(`📍 Nouveau point → X:${x} Y:${y}`);
});

// ================= FETCH LIEUX =================
fetch("data/lieux.json")
  .then(res => res.json())
  .then(lieux => {
    console.log("Lieux chargés :", lieux);

    lieux.forEach(lieu => {
      if (lieu.lat == null || lieu.lng == null) return;

      const marker = L.marker(
        [convertY(lieu.lat), convertX(lieu.lng)],
        {
          icon: lieu.avatar
            ? createAvatarIcon(lieu.avatar)
            : pinIcon,
          draggable: true
        }
      ).addTo(map);

      marker.bindPopup(`
        <strong>${lieu.nom}</strong><br>
        ${lieu.avatar ? `<img src="${lieu.avatar}" width="120">` : ""}
        <br><em>X:${lieu.lng} | Y:${lieu.lat}</em>
      `);

      marker.on("dragend", e => {
        const pos = e.target.getLatLng();
        console.log(
          `📦 ${lieu.nom} → X:${inverseX(pos.lng)} Y:${inverseY(pos.lat)}`
        );
      });
    });
  });
