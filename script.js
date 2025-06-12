// --- Inicialização do Mapa Leaflet ---
const map = L.map('map').setView([20, 0], 2);

// Adiciona camada base (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 6,
}).addTo(map);

// Dados dos países com informações ambientais e espécies
const countriesData = {
  brazil: {
    name: "Brasil",
    continent: "southamerica",
    coords: [-14.2350, -51.9253],
    treeCoverage: 58, // em %
    treeGrowthAnnual: 0.3, // % ao ano
    biodiversityIndex: 85,
    threatenedSpecies: [
      {name: "Onça-pintada", link: "https://pt.wikipedia.org/wiki/Onça-pintada"},
      {name: "Arara-azul", link: "https://pt.wikipedia.org/wiki/Arara-azul"},
      {name: "Mico-leão-dourado", link: "https://pt.wikipedia.org/wiki/Mico-leão-dourado"},
    ],
  },
  usa: {
    name: "Estados Unidos",
    continent: "northamerica",
    coords: [37.0902, -95.7129],
    treeCoverage: 33,
    treeGrowthAnnual: 0.2,
    biodiversityIndex: 75,
    threatenedSpecies: [
      {name: "Águia-careca", link: "https://pt.wikipedia.org/wiki/Águia-careca"},
      {name: "Lobo-cinzento", link: "https://pt.wikipedia.org/wiki/Lobo-cinzento"},
      {name: "Puma", link: "https://pt.wikipedia.org/wiki/Puma"},
    ],
  },
  india: {
    name: "Índia",
    continent: "asia",
    coords: [20.5937, 78.9629],
    treeCoverage: 24,
    treeGrowthAnnual: 0.5,
    biodiversityIndex: 80,
    threatenedSpecies: [
      {name: "Tigre-de-bengala", link: "https://pt.wikipedia.org/wiki/Tigre-de-bengala"},
      {name: "Elefante-asiático", link: "https://pt.wikipedia.org/wiki/Elefante-asiático"},
      {name: "Pangolim", link: "https://pt.wikipedia.org/wiki/Pangolim"},
    ],
  },
  southafrica: {
    name: "África do Sul",
    continent: "africa",
    coords: [-30.5595, 22.9375],
    treeCoverage: 7,
    treeGrowthAnnual: 0.1,
    biodiversityIndex: 70,
    threatenedSpecies: [
      {name: "Rinoceronte-negro", link: "https://pt.wikipedia.org/wiki/Rinoceronte-negro"},
      {name: "Leopardo", link: "https://pt.wikipedia.org/wiki/Leopardo"},
      {name: "Hiena-malhada", link: "https://pt.wikipedia.org/wiki/Hiena-malhada"},
    ],
  },
  australia: {
    name: "Austrália",
    continent: "oceania",
    coords: [-25.2744, 133.7751],
    treeCoverage: 17,
    treeGrowthAnnual: 0.15,
    biodiversityIndex: 77,
    threatenedSpecies: [
      {name: "Canguru-vermelho", link: "https://pt.wikipedia.org/wiki/Canguru-vermelho"},
      {name: "Diabo-da-tasmânia", link: "https://pt.wikipedia.org/wiki/Diabo-da-tasmânia"},
      {name: "Cacatua", link: "https://pt.wikipedia.org/wiki/Cacatua"},
    ],
  },
  canada: {
    name: "Canadá",
    continent: "northamerica",
    coords: [56.1304, -106.3468],
    treeCoverage: 38,
    treeGrowthAnnual: 0.25,
    biodiversityIndex: 72,
    threatenedSpecies: [
      {name: "Caribu", link: "https://pt.wikipedia.org/wiki/Caribu"},
      {name: "Lobo-do-árctico", link: "https://pt.wikipedia.org/wiki/Lobo-do-árctico"},
      {name: "Ursos-pardos", link: "https://pt.wikipedia.org/wiki/Ursos-pardos"},
    ],
  }
};

// --- Referências DOM ---
const speciesList = document.getElementById('species-list');
const globalList = document.getElementById('global-list');
const treeCoverageChartCtx = document.getElementById('treeCoverageChart').getContext('2d');
const biodiversityChartCtx = document.getElementById('biodiversityChart').getContext('2d');

const modeToggle = document.getElementById('mode-toggle');
const themeSelect = document.getElementById('theme-select');

// --- Estado Atual ---
let currentCountryKey = 'brazil';  // Brasil é padrão
let currentMode = 'light';         // modo claro por padrão

// --- Atualiza Mapa e Dados ---
function updateCountryData(key) {
  const country = countriesData[key];
  if (!country) return;

  currentCountryKey = key;

  // Atualiza centro do mapa
  map.setView(country.coords, 4);

  // Atualiza lista de espécies
  speciesList.innerHTML = '';
  country.threatenedSpecies.forEach(species => {
    const item = document.createElement('div');
    item.className = 'species-item';
    item.innerHTML = `<a href="${species.link}" target="_blank">${species.name}</a>`;
    speciesList.appendChild(item);
  });

  // Atualiza gráficos
  updateCharts(country);

  // Atualiza tema por continente
  updateTheme(country.continent);
}

// --- Atualiza Tema Regional ---
function updateTheme(continent) {
  // Remove todas as classes de tema existentes
  document.body.classList.remove(
    'theme-southamerica',
    'theme-africa',
    'theme-asia',
    'theme-europe',
    'theme-northamerica',
    'theme-oceania'
  );

  // Mapeia continentes para as classes
  const continentMap = {
    southamerica: 'theme-southamerica',
    africa: 'theme-africa',
    asia: 'theme-asia',
    europe: 'theme-europe',
    northamerica: 'theme-northamerica',
    oceania: 'theme-oceania'
  };

  if (continentMap[continent]) {
    document.body.classList.add(continentMap[continent]);
    themeSelect.value = continent;
  }
}

// --- Alterna modo claro/escuro ---
function toggleMode() {
  if (currentMode === 'light') {
    document.body.classList.add('dark-mode');
    currentMode = 'dark';
    modeToggle.textContent = 'Modo Claro';
  } else {
    document.body.classList.remove('dark-mode');
    currentMode = 'light';
    modeToggle.textContent = 'Modo Escuro';
  }
}

// --- Atualiza gráficos Chart.js ---
let treeCoverageChart, biodiversityChart;

function updateCharts(country) {
  const labels = [country.name];
  const treeData = [country.treeCoverage];
  const biodiversityData = [country.biodiversityIndex];

  if(treeCoverageChart) treeCoverageChart.destroy();
  if(biodiversityChart) biodiversityChart.destroy();

  treeCoverageChart = new Chart(treeCoverageChartCtx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: '% Cobertura de Árvores',
        data: treeData,
        backgroundColor: 'rgba(76, 175, 80, 0.7)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: { y: { beginAtZero: true, max: 100 } },
      responsive: true,
      plugins: { legend: { display: true } }
    }
  });

  biodiversityChart = new Chart(biodiversityChartCtx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Índice de Biodiversidade',
        data: biodiversityData,
        backgroundColor: 'rgba(33, 150, 243, 0.7)',
        borderColor: 'rgba(33, 150, 243, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: { y: { beginAtZero: true, max: 100 } },
      responsive: true,
      plugins: { legend: { display: true } }
    }
  });
}

// --- Popula lista global lateral ---
function populateGlobalList() {
  globalList.innerHTML = '';
  for (const key in countriesData) {
    const country = countriesData[key];
    const div = document.createElement('div');
    div.className = 'species-item';
    div.textContent = country.name;
    div.style.cursor = 'pointer';
    div.onclick = () => updateCountryData(key);
    globalList.appendChild(div);
  }
}

// --- Eventos ---
modeToggle.addEventListener('click', toggleMode);

themeSelect.addEventListener('change', (e) => {
  const selectedContinent = e.target.value;
  // Busca o primeiro país do continente selecionado para atualizar o mapa
  const firstCountry = Object.entries(countriesData).find(([k, v]) => v.continent === selectedContinent);
  if (firstCountry) {
    updateCountryData(firstCountry[0]);
  }
});

// Inicialização
populateGlobalList();
updateCountryData(currentCountryKey);
