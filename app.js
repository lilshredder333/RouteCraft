
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔥 REPLACE WITH YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentTrip = null;
let places = [];
let map = L.map('map').setView([40.4168, -3.7038], 6);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let markers = L.markerClusterGroup();
map.addLayer(markers);
let polyline = null;

function parseGoogleMapsLink(url) {
    const decoded = decodeURIComponent(url);
    const coordsMatch = decoded.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    const nameMatch = decoded.match(/\/place\/([^/]+)/);
    if (!coordsMatch) return null;
    return {
        name: nameMatch ? nameMatch[1].replace(/\+/g," ") : "Lugar",
        lat: parseFloat(coordsMatch[1]),
        lng: parseFloat(coordsMatch[2]),
        order: Date.now()
    };
}

document.getElementById("create-trip-btn").onclick = async () => {
    const name = document.getElementById("trip-name").value;
    const docRef = await addDoc(collection(db, "trips"), { name });
    currentTrip = docRef.id;
    listenPlaces();
};

document.getElementById("add-place-btn").onclick = async () => {
    const link = document.getElementById("gmaps-link").value;
    const place = parseGoogleMapsLink(link);
    if (!place || !currentTrip) return alert("Error");
    await addDoc(collection(db, "trips", currentTrip, "places"), place);
};

function listenPlaces() {
    const q = query(collection(db, "trips", currentTrip, "places"), orderBy("order"));
    onSnapshot(q, snapshot => {
        places = [];
        snapshot.forEach(doc => places.push({ id: doc.id, ...doc.data() }));
        render();
    });
}

function render() {
    markers.clearLayers();
    if (polyline) map.removeLayer(polyline);

    const list = document.getElementById("place-list");
    list.innerHTML = "";

    const latlngs = [];

    places.forEach(p => {
        const marker = L.marker([p.lat, p.lng]);
        markers.addLayer(marker);
        latlngs.push([p.lat, p.lng]);

        const li = document.createElement("li");
        li.textContent = p.name;
        li.dataset.id = p.id;
        list.appendChild(li);
    });

    if (latlngs.length > 1) {
        polyline = L.polyline(latlngs, { color: 'cyan' }).addTo(map);
        map.fitBounds(polyline.getBounds());
    }

    new Sortable(list, {
        animation: 150,
        onEnd: evt => reorder()
    });
}

function reorder() {
    const ids = [...document.querySelectorAll("#place-list li")].map(li => li.dataset.id);
    ids.forEach((id, index) => {
        const placeRef = collection(db, "trips", currentTrip, "places");
        // Simplified: In production you'd update order field properly
    });
}

document.getElementById("export-btn").onclick = () => {
    if (!places.length) return;
    const url = "https://www.google.com/maps/dir/" +
        places.map(p => `${p.lat},${p.lng}`).join("/");
    window.open(url, "_blank");
};
