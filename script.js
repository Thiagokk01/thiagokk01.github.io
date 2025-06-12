// Tema claro/escuro
const toggleBtn = document.getElementById("toggleTheme");
toggleBtn.addEventListener("click", () => {
  const body = document.body;
  if (body.getAttribute("data-theme") === "light") {
    body.setAttribute("data-theme", "dark");
    toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    body.setAttribute("data-theme", "light");
    toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
  }
});

// Dados simulados
const treeCoverageData = [45, 48, 50, 52, 55, 57, 60, 63, 67, 70];
const co2ReductionData = [5, 8, 10, 15, 20, 25, 30, 33, 38, 45];
const biodiversityIndex = 78;

document.getElementById("treeCoverage").textContent = treeCoverageData.slice(-1)[0] + "%";
document.getElementById("co2Reduction").textContent = co2ReductionData.slice(-1)[0] + "%";
document.getElementById("biodiversityIndex").textContent = biodiversityIndex;

// Gráficos Chart.js
const treeCtx = document.getElementById("treeCoverageChart").getContext("2d");
const co2Ctx = document.getElementById("co2ReductionChart").getContext("2d");

const treeChart = new Chart(treeCtx, {
  type: "line",
  data: {
    labels: [...Array(treeCoverageData.length).keys()].map(i => `Ano ${2015 + i}`),
    datasets: [{
      label: "Cobertura de Árvores (%)",
      data: treeCoverageData,
      borderColor: "#3a8e3a",
      backgroundColor: "rgba(58, 142, 58, 0.2)",
      fill: true,
      tension: 0.3,
      pointRadius: 5,
      pointHoverRadius: 7,
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true, max: 100 }
    }
  }
});

const co2Chart = new Chart(co2Ctx, {
  type: "bar",
  data: {
    labels: [...Array(co2ReductionData.length).keys()].map(i => `Ano ${2015 + i}`),
    datasets: [{
      label: "Redução de CO₂ (%)",
      data: co2ReductionData,
      backgroundColor: "#2d6a2d",
      borderRadius: 5,
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true, max: 100 }
    }
  }
});

// Mapa Leaflet
const map = L.map("map").setView([-15.7801, -47.9292], 4);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '© OpenStreetMap contributors',
}).addTo(map);

// Marcadores exemplo
const locations = [
  { name: "Floresta Amazônica", coords: [-3.4653, -62.2159] },
  { name: "Pantanal", coords: [-18.6570, -56.1305] },
  { name: "Mata Atlântica", coords: [-23.5505, -46.6333] }
];

locations.forEach(loc => {
  L.marker(loc.coords)
    .addTo(map)
    .bindPopup(`<b>${loc.name}</b>`);
});

// Lista de espécies ameaçadas
const speciesThreatened = [
  { name: "Onça-pintada", scientific: "Panthera onca", status: "Vulnerável" },
  { name: "Arara-azul", scientific: "Anodorhynchus hyacinthinus", status: "Em perigo" },
  { name: "Mico-leão-dourado", scientific: "Leontopithecus rosalia", status: "Criticamente em perigo" },
  { name: "Tamanduá-bandeira", scientific: "Myrmecophaga tridactyla", status: "Vulnerável" }
];

const speciesListDiv = document.getElementById("speciesList");
speciesThreatened.forEach(species => {
  const div = document.createElement("div");
  div.classList.add("species-item");
  div.innerHTML = `
    <div class="species-name">${species.name}</div>
    <div class="species-scientific">${species.scientific}</div>
    <div class="species-status">Status: ${species.status}</div>
  `;
  speciesListDiv.appendChild(div);
});
