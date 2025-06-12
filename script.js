// script.js

const countriesData = [
  {
    name: "Brasil",
    latlng: [-14.235, -51.9253],
    co2: 200,
    trees: 500,
    biodiversity: 900,
    species: [
      {
        name: "Onça-pintada",
        scientific: "Panthera onca",
        status: "Vulnerável",
        region: "Amazônia",
        color: "#e67e22",
      },
      {
        name: "Mico-leão-dourado",
        scientific: "Leontopithecus rosalia",
        status: "Criticamente em perigo",
        region: "Mata Atlântica",
        color: "#c0392b",
      },
    ],
  },
  {
    name: "Estados Unidos",
    latlng: [37.0902, -95.7129],
    co2: 400,
    trees: 300,
    biodiversity: 700,
    species: [
      {
        name: "Águia-careca",
        scientific: "Haliaeetus leucocephalus",
        status: "Pouco preocupante",
        region: "Norte da América",
        color: "#27ae60",
      },
    ],
  },
  {
    name: "Índia",
    latlng: [20.5937, 78.9629],
    co2: 350,
    trees: 450,
    biodiversity: 850,
    species: [
      {
        name: "Tigre-de-bengala",
        scientific: "Panthera tigris tigris",
        status: "Em perigo",
        region: "Florestas Indianas",
        color: "#d35400",
      },
    ],
  },
];

let map, markers = [], currentCountry = null;

function initMap() {
  map = L.map("map").setView([20, 0], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  countriesData.forEach((country) => {
    const marker = L.circleMarker(country.latlng, {
      radius: 10,
      fillColor: "#2e8b57",
      color: "#1b4d3e",
      weight: 2,
      fillOpacity: 0.8,
    })
      .addTo(map)
      .bindTooltip(country.name)
      .on("click", () => selectCountry(country));

    markers.push(marker);
  });
}

function selectCountry(country) {
  currentCountry = country;
  map.setView(country.latlng, 5);

  document.getElementById("country-name").textContent = country.name;
  const speciesList = document.getElementById("species-list");
  speciesList.innerHTML = "";

  country.species.forEach((sp) => {
    const div = document.createElement("div");
    div.className = "species-item";
    div.innerHTML = `
      <div class="species-name">${sp.name}</div>
      <div class="species-scientific">${sp.scientific}</div>
      <div class="species-status" style="color:${sp.color}">Status: ${sp.status}</div>
      <div class="species-region">Região: ${sp.region}</div>
    `;
    speciesList.appendChild(div);
  });

  updateCharts(country);
}

let chartCo2, chartTrees, chartBiodiversity;

function createCharts() {
  chartCo2 = new Chart(document.getElementById("chartCo2"), {
    type: "bar",
    data: {
      labels: countriesData.map(c => c.name),
      datasets: [{
        label: "Emissão CO₂",
        data: countriesData.map(c => c.co2),
        backgroundColor: "#27ae60",
      }],
    },
    options: { responsive: true, plugins: { legend: { display: false } } },
  });

  chartTrees = new Chart(document.getElementById("chartTrees"), {
    type: "line",
    data: {
      labels: countriesData.map(c => c.name),
      datasets: [{
        label: "Cobertura de árvores",
        data: countriesData.map(c => c.trees),
        backgroundColor: "rgba(46,139,87,0.5)",
        borderColor: "#2e8b57",
        fill: true,
      }],
    },
    options: { responsive: true },
  });

  chartBiodiversity = new Chart(document.getElementById("chartBiodiversity"), {
    type: "radar",
    data: {
      labels: countriesData.map(c => c.name),
      datasets: [{
        label: "Biodiversidade",
        data: countriesData.map(c => c.biodiversity),
        backgroundColor: "rgba(39,174,96,0.4)",
        borderColor: "#27ae60",
      }],
    },
    options: { responsive: true },
  });
}

function updateCharts(country) {
  // Atualização customizada se quiser destacar país
}

function setupSearch() {
  document.getElementById("search-country").addEventListener("input", e => {
    const query = e.target.value.toLowerCase();
    markers.forEach((marker, i) => {
      countriesData[i].name.toLowerCase().includes(query)
        ? marker.addTo(map)
        : map.removeLayer(marker);
    });
  });

  document.getElementById("search-species").addEventListener("input", e => {
    const query = e.target.value.toLowerCase();
    const filtered = countriesData.filter(country =>
      country.species.some(sp =>
        sp.name.toLowerCase().includes(query) || sp.status.toLowerCase().includes(query)
      )
    );
    markers.forEach((marker, i) => {
      filtered.includes(countriesData[i])
        ? marker.addTo(map)
        : map.removeLayer(marker);
    });
  });
}

function setupDarkMode() {
  const btn = document.getElementById("mode-toggle");
  const icon = btn.querySelector("i");
  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    icon.classList.toggle("fa-sun");
    icon.classList.toggle("fa-moon");
  });
}

function createLegend() {
  const legend = document.getElementById("legend");
  const statuses = [
    { label: "Criticamente em perigo", color: "#c0392b" },
    { label: "Em perigo", color: "#d35400" },
    { label: "Vulnerável", color: "#e67e22" },
    { label: "Pouco preocupante", color: "#27ae60" },
  ];
  statuses.forEach((s) => {
    const div = document.createElement("div");
    div.className = "legend-item";
    div.innerHTML = `<div class="legend-color" style="background-color:${s.color};"></div><span>${s.label}</span>`;
    legend.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", () => {

// Dados por país (mesmo que antes)
const countriesData = [
  /* ... como antes ... */
];

// Lista global de espécies ameaçadas
const globalThreatenedSpecies = [
  { name: "Tigre", scientific: "Panthera tigris", status: "Em Perigo", region: "Ásia", color: "#d32f2f" },
  { name: "Elefante-Africano", scientific: "Loxodonta africana", status: "Vulnerável", region: "África", color: "#f57c00" },
  { name: "Urso Polar", scientific: "Ursus maritimus", status: "Vulnerável", region: "Ártico", color: "#0288d1" },
  { name: "Panda Gigante", scientific: "Ailuropoda melanoleuca", status: "Vulnerável", region: "China", color: "#7b1fa2" },
  { name: "Arraia Manta", scientific: "Mobula birostris", status: "Em Perigo", region: "Oceania", color: "#00796b" }
];

// Dados simulados de árvores e clima por país
countriesData.forEach(c => {
  c.treesYearly = c.trees * 1.1;  // exemplo: aumento de 10%
  c.temperature = Math.round(Math.random() * 15 + 10);  // temp média
});

let map, markers = [], currentCountry = null;
let chartCo2, chartTrees, chartBiodiversity, chartClimate;

function initMap() {
  map = L.map("map").setView([20,0],2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  countriesData.forEach(country => {
    const marker = L.circleMarker(country.latlng, {
      radius: 10,
      fillColor: "#2e8b57",
      color: "#1b4d3e",
      weight: 2,
      fillOpacity: 0.8,
    }).addTo(map)
      .bindTooltip(country.name)
      .on("click", () => selectCountry(country));

    markers.push(marker);
  });
}

function selectCountry(country) {
  currentCountry = country;
  map.setView(country.latlng, 5);
  document.getElementById("country-name").textContent = country.name;

  const speciesList = document.getElementById("species-list");
  speciesList.innerHTML = "";
  country.species.forEach(sp => {
    const div = document.createElement("div");
    div.className = "species-item";
    div.innerHTML = `
      <div class="species-name">${sp.name}</div>
      <div class="species-scientific">${sp.scientific}</div>
      <div class="species-status" style="color:${sp.color}">Status: ${sp.status}</div>
      <div class="species-region">Região: ${sp.region}</div>
    `;
    speciesList.appendChild(div);
  });

  updateCharts(country);
}

function displayGlobalSpecies() {
  const container = document.getElementById("global-list");
  container.innerHTML = "";
  globalThreatenedSpecies.forEach(sp => {
    const div = document.createElement("div");
    div.className = "species-item";
    div.innerHTML = `
      <div class="species-name">${sp.name}</div>
      <div class="species-scientific">${sp.scientific}</div>
      <div class="species-status" style="color:${sp.color}">${sp.status}</div>
      <div class="species-region">${sp.region}</div>
    `;
    container.appendChild(div);
  });
}

function createCharts() {
  // CO2
  chartCo2 = new Chart(document.getElementById("chartCo2"), {
    type: "bar",
    data: {
      labels: countriesData.map(c => c.name),
      datasets: [{
        label: "Emissão CO₂",
        data: countriesData.map(c => c.co2),
        backgroundColor: "#27ae60",
      }],
    },
    options: { responsive: true, plugins: { legend: { display: false } } },
  });

  // Árvores (anual)
  chartTrees = new Chart(document.getElementById("chartTrees"), {
    type: "line",
    data: {
      labels: countriesData.map(c => c.name),
      datasets: [{
        label: "Árvores (total e anual)",
        data: countriesData.map(c => c.trees),
        borderColor: "#2e8b57", backgroundColor: "rgba(46,139,87,0.5)",
        fill: true,
      }, {
        label: "Árvores (ano seguinte)",
        data: countriesData.map(c => Math.round(c.treesYearly)),
        borderColor: "#145214", backgroundColor: "rgba(20,82,20,0.3)",
        fill: true,
      }]
    },
    options: { responsive: true },
  });

  // Biodiversidade
  chartBiodiversity = new Chart(document.getElementById("chartBiodiversity"), {
    type: "radar",
    data: {
      labels: countriesData.map(c => c.name),
      datasets: [{
        label: "Biodiversidade",
        data: countriesData.map(c => c.biodiversity),
        backgroundColor: "rgba(39,174,96,0.4)",
        borderColor: "#27ae60"
      }]
    },
    options: { responsive: true },
  });

  // Clima (temperatura)
  chartClimate = new Chart(document.createElement("canvas"), {
    type: "bar",
    data: {
      labels: countriesData.map(c => c.name),
      datasets: [{
        label: "Temp. média (°C)",
        data: countriesData.map(c => c.temperature),
        backgroundColor: "#f39c12",
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } },
  });
  document.getElementById("charts").appendChild(chartClimate.canvas);
}

function updateCharts(country) {
  const idx = countriesData.findIndex(c => c.name === country.name);
  chartCo2.data.datasets[0].backgroundColor = countriesData.map((_, i) => i === idx ? "#f39c12" : "#27ae60");
  chartCo2.update();

  chartTrees.data.datasets.forEach(ds => {
    ds.backgroundColor = ds.backgroundColor.map ? ds.backgroundColor.map((c, i) => i === idx ? "#f39c12" : c) : ds.backgroundColor;
  });
  chartTrees.update();
}

function setupSearch() {
  document.getElementById("search-country").oninput = e => {
    const q = e.target.value.toLowerCase();
    markers.forEach((m,i) => {
      countriesData[i].name.toLowerCase().includes(q) ? m.addTo(map): map.removeLayer(m);
    });
  };
  document.getElementById("search-species").oninput = e => {
    const q = e.target.value.toLowerCase();
    countriesData.forEach((c,i) => {
      const ok = c.species.some(sp => sp.name.toLowerCase().includes(q) || sp.status.toLowerCase().includes(q));
      ok ? markers[i].addTo(map) : map.removeLayer(markers[i]);
    });
  };
}

function setupDarkMode() {
  const btn = document.getElementById("mode-toggle");
  const icon = btn.querySelector("i");
  btn.onclick = () => {
    document.body.classList.toggle("dark-mode");
    icon.classList.toggle("fa-sun");
    icon.classList.toggle("fa-moon");
  };
}

function createLegend() {
  const legend = document.getElementById("legend");
  [{"Criticamente em perigo":"#c0392b"},{"Em perigo":"#d35400"},{"Vulnerável":"#e67e22"},{"Pouco preocupante":"#27ae60"}]
    .forEach(o=>{
      const label = Object.keys(o)[0], color = o[label];
      const div = document.createElement("div");
      div.className = "legend-item";
      div.innerHTML = `<div class="legend-color" style="background:${color}"></div><span>${label}</span>`;
      legend.appendChild(div);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  displayGlobalSpecies();
  createCharts();
  setupSearch();
  setupDarkMode();
  createLegend();
});

