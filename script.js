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
  initMap();
  createCharts();
  setupSearch();
  setupDarkMode();
  createLegend();
});
