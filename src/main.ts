import "./style.css";
import L, { LeafletMouseEvent } from "leaflet";
import dotUrl from "./dot.svg";
import personWeights from "./persons.json";
import locations from "./locations.json";
import { Person } from "./Person";
import { calculateAverage, getSizeOfDot } from "./util";

// Initialize map
const maxZoom = 6.7;
let map = L.map("map", {
  zoomSnap: 0.1,
  zoom: maxZoom,
}).setView([57.48040333923341, 14.611816406250002]);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  minZoom: maxZoom,
  maxZoom: 20,
  attribution:
    '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
}).addTo(map);

// show the scale bar on the lower left corner
L.control.scale({ imperial: false, metric: true }).addTo(map);

// Map persons from json
let persons: Person[] = personWeights
  .map((p) => ({ ...p, location: locations.find((l) => l.id === p.location) }))
  .filter((p) => {
    if (!p.location) {
      console.error("Could not find location for person!", p);
      return false;
    }
    return true;
  })
  .map((p) => ({
    id: p.id,
    lat: p.location!.lat,
    lng: p.location!.lng,
    weight: p.weight,
  }));

// persons = [];
let averageMarker: L.Marker;

const addMarker = (
  map: L.Map,
  weight: number,
  lat: number,
  lng: number,
  tooltipName?: string,
  dotUrl?: string
) => {
  const dotSize = getSizeOfDot(weight);
  const options = dotUrl
    ? {
        icon: L.icon({
          iconUrl: dotUrl,
          iconSize: [dotSize, dotSize],
          iconAnchor: [dotSize / 2, dotSize / 2],
        }),
      }
    : undefined;
  return L.marker({ lat: lat, lng: lng }, options)
    .bindTooltip(tooltipName ?? "")
    .addTo(map);
};

const addAverage = (map: L.Map, persons: Person[]) => {
  const { averageLat, averageLng } = calculateAverage(persons);
  averageMarker?.removeFrom(map);
  averageMarker = addMarker(map, 5, averageLat, averageLng, "Här ska du bo!");
  map.addLayer(averageMarker);
};

const addPersonDot = (
  map: L.Map,
  name: string,
  lat: number,
  lng: number,
  weight: number
) => {
  const personMarker = addMarker(map, weight, lat, lng, name, dotUrl);
  map.addLayer(personMarker);
  addAverage(map, persons);
  return personMarker;
};

const listPersons = (map: L.Map, persons: Person[]) => {
  const elementList = persons.map((p) => {
    const personDiv = document.createElement("div");
    const personDivSpan = document.createElement("span");
    const personDivButton = document.createElement("button");
    personDivButton.innerText = "X";
    personDivButton.onclick = () => removePerson(p.id);
    personDivSpan.innerText = `${p.id} (${p.weight})`;
    personDiv.appendChild(personDivSpan);
    personDiv.appendChild(personDivButton);
    return personDiv;
  });
  getById("personList").replaceChildren(...elementList);
  const markers: L.Marker[] = persons
    .map((p) => p.marker)
    .filter((m) => m !== undefined)
    .map((m) => m as L.Marker);
  const layerGroup = L.layerGroup(markers).addTo(map);
  L.control.layers({}, { hi: layerGroup, ho: layerGroup }).addTo(map);
};

const removePerson = (map: L.Map, name: string) => {
  const person = persons.find((p) => p.id === name);
  person?.marker?.remove();
  persons = persons.filter((p) => p.id !== name);
  listPersons(map, persons);
  addAverage(map, persons);
};

const createNewPerson = (e: SubmitEvent) => {
  e.preventDefault();
  const name = getById<HTMLFormElement>("name").value;
  const weight = Number.parseInt(getById<HTMLFormElement>("weight").value);
  const lat = getById<HTMLFormElement>("latitude").value;
  const lng = getById<HTMLFormElement>("longitude").value;
  if (name && weight) {
    const marker = addPersonDot(map, name, lat, lng, weight);
    persons = [...persons, { id: name, lat, lng, weight: weight, marker }];
    getById<HTMLFormElement>("name").value = "";
    getById<HTMLFormElement>("weight").value = "";
    listPersons(map, persons);
  }
};

const addNewLayer = () => {};

const getById = <T extends HTMLElement>(id: string) =>
  <T>document.getElementById(id);

const onMapClick = ({ latlng }: LeafletMouseEvent) => {
  getById<HTMLInputElement>("latitude").value = latlng.lat.toString();
  getById<HTMLInputElement>("longitude").value = latlng.lng.toString();
};
map.on("click", onMapClick);

const form = getById<HTMLFormElement>("form");
const newLayerButton = getById<HTMLFormElement>("newLayerButton");
form?.addEventListener("submit", createNewPerson);
newLayerButton?.addEventListener("click", addNewLayer);

persons = persons.map((p) => {
  const marker = addPersonDot(map, p.id, p.lat, p.lng, p.weight);
  return { ...p, marker };
});

listPersons(map, persons);
