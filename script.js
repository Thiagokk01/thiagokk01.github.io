// script.js - código robusto e comentado para EcoTracker PRO

// ----- Tema claro/escuro -----
const body = document.body;
const toggleBtn = document.getElementById('toggleTheme');
toggleBtn.addEventListener('click', () => {
  if (body.dataset.theme === 'light') {
    body.dataset.theme = 'dark';
    toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    body.dataset.theme = 'light';
    toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
  }
});

// ----- Inicialização do mapa Leaflet -----
const map = L.map('map').setView([-15.7942, -47.8822], 4); // Centro do Brasil

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Marcadores por regiões (exemplo)
const regionsMarkers = [
  { name: 'Amazônia', coords: [-3.4653, -62.2159], trees: 85, co2: 35 },
  { name: 'Cerrado', coords: [-15.7801, -47.9292], trees: 48, co2: 20 },
  { name: 'Mata Atlântica', coords: [-23.5505, -46.6333], trees: 62, co2: 25 },
  { name: 'Pantanal', coords: [-16.6758, -56.0926], trees: 72, co2: 30 },
  { name: 'Caatinga', coords: [-9.3975, -40.5039], trees: 40, co2: 15 },
];

// Adiciona marcadores com popups
regionsMarkers.forEach(region => {
  const marker = L.marker(region.coords).addTo(map);
  marker.bindPopup(`
    <strong>${region.name}</strong><br>
    Cobertura de árvores: ${region.trees}%<br>
    Redução de CO₂: ${region.co2}%
  `);
});

// ----- Atualizar indicadores -----
const treeCoverageEl = document.getElementById('treeCoverage');
const co2ReductionEl = document.getElementById('co2Reduction');
const biodiversityIndexEl = document.getElementById('biodiversityIndex');

// Calcula média simples para exemplo
function atualizarIndicadores() {
  const avgTrees = Math.round(
    regionsMarkers.reduce((acc, cur) => acc + cur.trees, 0) / regionsMarkers.length
  );
  const avgCo2 = Math.round(
    regionsMarkers.reduce((acc, cur) => acc + cur.co2, 0) / regionsMarkers.length
  );
  // Biodiversidade simulada
  const biodiversityIndex = 70 + Math.floor(Math.random() * 20);

  treeCoverageEl.textContent = avgTrees + '%';
  co2ReductionEl.textContent = avgCo2 + '%';
  biodiversityIndexEl.textContent = biodiversityIndex;
}
atualizarIndicadores();

// ----- Gráfico de barras - Cobertura de Árvores -----
const ctxTrees = document.getElementById('treeCoverageChart').getContext('2d');
const treeChart = new Chart(ctxTrees, {
  type: 'bar',
  data: {
    labels: regionsMarkers.map(r => r.name),
    datasets: [
      {
        label: 'Cobertura de Árvores (%)',
        data: regionsMarkers.map(r => r.trees),
        backgroundColor: 'rgba(58, 142, 58, 0.7)',
        borderColor: 'rgba(58, 142, 58, 1)',
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          color: '#1f4d1f',
        },
        grid: {
          color: '#d9f0d9',
        },
      },
      x: {
        ticks: {
          color: '#1f4d1f',
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#3a8e3a',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
    },
  },
});

// ----- Gráfico pizza - Redução de CO₂ -----
const ctxCo2 = document.getElementById('co2ReductionChart').getContext('2d');
const co2Chart = new Chart(ctxCo2, {
  type: 'doughnut',
  data: {
    labels: regionsMarkers.map(r => r.name),
    datasets: [
      {
        label: 'Redução de CO₂ (%)',
        data: regionsMarkers.map(r => r.co2),
        backgroundColor: [
          'rgba(58, 142, 58, 0.7)',
          'rgba(74, 174, 74, 0.7)',
          'rgba(98, 190, 98, 0.7)',
          'rgba(122, 206, 122, 0.7)',
          'rgba(146, 222, 146, 0.7)',
        ],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  },
  options: {
    responsive: true,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#1f4d1f',
          font: {
            weight: '600',
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: '#3a8e3a',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
    },
  },
});

// ----- Fetch de espécies ameaçadas (Simulado) -----
const speciesListEl = document.getElementById('speciesList');

// Dados simulados (exemplo, normalmente viria de API real)
const speciesAmeaçadas = [
  {
    name: "Onça-pintada",
    scientificName: "Panthera onca",
    status: "Vulnerável",
  },
  {
    name: "Arara-azul-grande",
    scientificName: "Anodorhynchus hyacinthinus",
    status: "Em perigo",
  },
  {
    name: "Tartaruga-de-couro",
    scientificName: "Dermochelys coriacea",
    status: "Criticamente em perigo",
  },
  {
    name: "Mico-leão-dourado",
    scientificName: "Leontopithecus rosalia",
    status: "Em perigo",
  },
  {
    name: "Boto-cor-de-rosa",
    scientificName: "Inia geoffrensis",
    status: "Vulnerável",
  },
];

// Função para mostrar as espécies no DOM
function mostrarEspecies(especies) {
  speciesListEl.innerHTML = ''; // Limpa lista

  especies.forEach(especie => {
    const item = document.createElement('article');
    item.className = 'species-item';
    item.tabIndex = 0;
    item.innerHTML = `
      <p class="species-name">${especie.name}</p>
      <p class="species-scientific">${especie.scientificName}</p>
      <p class="species-status">Status: ${especie.status}</p>
    `;
    speciesListEl.appendChild(item);
  });
}
mostrarEspecies(speciesAmeaçadas);

// Atualização automática (exemplo, a cada 60 segundos)
setInterval(() => {
  // No futuro pode-se buscar dados reais via fetch...
  mostrarEspecies(speciesAmeaçadas);
}, 60000);
