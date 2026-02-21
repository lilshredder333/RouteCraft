
import { RouteOptimizer } from './optimizer.js';
import { Storage } from './storage.js';

const form = document.getElementById("place-form");
const placesContainer = document.getElementById("places");
const routeContainer = document.getElementById("route");
const statsContainer = document.getElementById("stats");
const generateBtn = document.getElementById("generate-btn");
const clearBtn = document.getElementById("clear-btn");

let places = Storage.load() || [];

renderPlaces();

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const lat = parseFloat(document.getElementById("lat").value);
    const lng = parseFloat(document.getElementById("lng").value);

    places.push({ name, lat, lng });
    Storage.save(places);
    renderPlaces();
    form.reset();
});

generateBtn.addEventListener("click", () => {
    if (places.length < 2) return alert("Añade al menos 2 lugares.");
    const optimized = RouteOptimizer.optimize(places);
    renderRoute(optimized);
});

clearBtn.addEventListener("click", () => {
    places = [];
    Storage.save(places);
    renderPlaces();
    routeContainer.innerHTML = "";
    statsContainer.innerHTML = "";
});

function renderPlaces() {
    placesContainer.innerHTML = "";
    places.forEach((p, i) => {
        const div = document.createElement("div");
        div.className = "place-item";
        div.innerText = `${i + 1}. ${p.name}`;
        placesContainer.appendChild(div);
    });
}

function renderRoute(route) {
    routeContainer.innerHTML = "";
    route.forEach((p, i) => {
        const div = document.createElement("div");
        div.className = "route-item";
        div.innerText = `${i + 1}. ${p.name}`;
        routeContainer.appendChild(div);
    });

    const distance = RouteOptimizer.totalDistance(route);
    statsContainer.innerText = `Distancia total aproximada: ${distance.toFixed(4)} unidades`;
}
