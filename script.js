// --- Tema claro/escuro ---
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

// --- Dados simulados ---
const treeCoverageData = [45, 48, 50, 52, 55, 57, 60, 63, 67, 70];
const co2ReductionData = [5, 8, 10, 15, 20, 25, 30, 33, 38, 45];
const biodiversityIndex = 78;

document.getElementById("treeCoverage").textContent = treeCoverageData.slice(-1)[0] + "%";
document.getElementById("co2Reduction").textContent = co2ReductionData.slice(-1)[0] + "%";
document.getElementById("biodiversityIndex").textContent = biodiversityIndex;

// --- Gráficos Chart.js ---

const treeCtx = document.getElementById("treeCoverageChart").getContext("2d");
const co2Ctx = document.getElementById("co2ReductionChart").getContext("2d");

const treeChart = new Chart(treeCtx, {
  type: "line",
  data: {
    labels: Array.from({ length: treeCoverageData.length }, (_, i) => 2015 + i),
    datasets: [{
      label: "Cobertura de Árvores (%)",
      data: treeCoverageData,
      backgroundColor: "rgba(58, 142, 58, 0.3)",
      borderColor: "#3a8e3a",
      borderWidth: 2,
      fill: true,
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 6,
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  }
});

const co2Chart = new Chart(co2Ctx, {
  type: "bar",
  data: {
    labels: Array.from({ length: co2ReductionData.length }, (_, i) => 2015 + i),
    datasets: [{
      label: "Redução de CO₂ (%)",
      data: co2ReductionData,
      backgroundColor: "rgba(58, 142, 58, 0.6)",
      borderColor: "#3a8e3a",
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  }
});

// --- Mapa Leaflet ---
const map = L.map("map").setView([-15.7801, -47.9292], 4); // Brasil - Brasília

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Marcadores exemplo
const markers = [
  {
    coords: [-3.4653, -62.2159],
    title: "Amazônia - Floresta",
    description: "Maior floresta tropical do mundo, rica em biodiversidade.",
  },
  {
    coords: [-23.5505, -46.6333],
    title: "São Paulo - Área Urbana",
    description: "Monitoramento da área urbana e impacto ambiental.",
  },
  {
    coords: [-22.9068, -43.1729],
    title: "Rio de Janeiro - Litoral",
    description: "Monitoramento da qualidade da água e espécies marinhas.",
  },
];

markers.forEach(({ coords, title, description }) => {
  L.marker(coords)
    .addTo(map)
    .bindPopup(`<strong>${title}</strong><br>${description}`);
});

// --- Espécies Ameaçadas ---
// Exemplo simples de dados, pode expandir ou carregar via fetch
const speciesData = [
  {
    name: "Onça-pintada",
    scientificName: "Panthera onca",
    status: "Vulnerável",
    region: "América do Sul",
    color: "#FFA500", // laranja
  },
  {
    name: "Mico-leão-dourado",
    scientificName: "Leontopithecus rosalia",
    status: "Em perigo",
    region: "Brasil",
    color: "#FF4500", // vermelho forte
  },
  {
    name: "Tartaruga-de-couro",
    scientificName: "Dermochelys coriacea",
    status: "Criticamente em perigo",
    region: "Oceano Atlântico",
    color: "#FF0000", // vermelho
  },
  {
    name: "Arara-azul",
    scientificName: "Anodorhynchus hyacinthinus",
    status: "Vulnerável",
    region: "América do Sul",
    color: "#FFA500",
  },
];

const speciesListEl = document.getElementById("speciesList");

function mostrarEspecies(especies) {
  speciesListEl.innerHTML = ""; // limpa

  especies.forEach((especie) => {
    const item = document.createElement("div");
    item.className = "species-item";
    item.innerHTML = `
      <p class="species-name">${especie.name}</p>
      <p class="species-scientific">${especie.scientificName}</p>
      <p class="species-status" style="color:${especie.color}">Status: ${especie.status} - ${especie.region}</p>
    `;
    speciesListEl.appendChild(item);
  });
}

mostrarEspecies(speciesData);

// Atualização automática (exemplo, a cada 60 segundos)
setInterval(() => {
  mostrarEspecies(speciesData);
}, 60000);
