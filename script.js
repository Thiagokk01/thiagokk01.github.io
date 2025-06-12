// --- Inicialização do mapa Leaflet ---
const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 6,
}).addTo(map);

// --- Dados dos países ---
const countriesData = {
  brazil: {
    name: "Brasil",
    continent: "southamerica",
    coords: [-14.2350, -51.9253],
    treeCoverage: 58,
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
    biodiversityIndex: 70,
    threatenedSpecies: [
      {name: "Rinoceronte-negro", link: "https://pt.wikipedia.org/wiki/Rinoceronte-negro"},
      {name: "Leopardo", link: "https://pt.wikipedia.org/wiki/Leopardo"},
      {name: "Tartaruga-de-pente", link: "https://pt.wikipedia.org/wiki/Tartaruga-de-pente"},
    ],
  },
};

// --- Lista global de espécies ameaçadas ---
const globalThreatenedSpecies = [
  {name: "Gorila-das-montanhas", link: "https://pt.wikipedia.org/wiki/Gorila-das-montanhas"},
  {name: "Panda-gigante", link: "https://pt.wikipedia.org/wiki/Panda-gigante"},
  {name: "Tigre-de-sumatra", link: "https://pt.wikipedia.org/wiki/Tigre-de-sumatra"},
  {name: "Lêmure-de-cauda-anelada", link: "https://pt.wikipedia.org/wiki/Lêmure-de-cauda-anelada"},
];

// --- Variáveis para controle ---
let currentCountryKey = null;

// --- Elementos DOM ---
const countryNameEl = document.getElementById('country-name');
const speciesListEl = document.getElementById('species-list');
const globalListEl = document.getElementById('global-list');
const themeSelectEl = document.getElementById('theme-select');
const modeToggleBtn = document.getElementById('mode-toggle');
const searchCountryInput = document.getElementById('search-country');
const searchSpeciesInput = document.getElementById('search-species');

// --- Função para mostrar dados do país ---
function showCountryData(key) {
  if (!countriesData[key]) return;
  currentCountryKey = key;
  const country = countriesData[key];
  countryNameEl.textContent = country.name;

  // Limpar lista anterior
  speciesListEl.innerHTML = "";

  country.threatenedSpecies.forEach(species => {
    const div = document.createElement('div');
    div.classList.add('species-item');
    div.innerHTML = `<a href="${species.link}" target="_blank" rel="noopener">${species.name}</a>`;
    speciesListEl.appendChild(div);
  });

  // Centralizar mapa no país
  map.setView(country.coords, 4);

  updateCharts(country);
}

// --- Mostrar lista global ---
function populateGlobalSpecies() {
  globalListEl.innerHTML = "";
  globalThreatenedSpecies.forEach(species => {
    const div = document.createElement('div');
    div.classList.add('species-item');
    div.textContent = species.name;
    div.title = "Clique para ver espécies deste país relacionado";
    div.style.cursor = "default";
    globalListEl.appendChild(div);
  });
}

// --- Pesquisa países ---
searchCountryInput.addEventListener('input', e => {
  const val = e.target.value.toLowerCase();

  const foundKey = Object.keys(countriesData).find(key => 
    countriesData[key].name.toLowerCase().includes(val)
  );

  if(foundKey) showCountryData(foundKey);
});

// --- Pesquisa espécies ---
searchSpeciesInput.addEventListener('input', e => {
  const val = e.target.value.toLowerCase();
  if (!currentCountryKey) return;

  const country = countriesData[currentCountryKey];
  speciesListEl.innerHTML = "";

  country.threatenedSpecies
    .filter(species => species.name.toLowerCase().includes(val))
    .forEach(species => {
      const div = document.createElement('div');
      div.classList.add('species-item');
      div.innerHTML = `<a href="${species.link}" target="_blank" rel="noopener">${species.name}</a>`;
      speciesListEl.appendChild(div);
    });
});

// --- Troca de tema por continente ---
themeSelectEl.addEventListener('change', e => {
  const theme = e.target.value;
  document.body.className = ''; // limpa todos
  if (theme !== 'default') {
    document.body.classList.add(`theme-${theme}`);
  }
});

// --- Modo claro / escuro ---
modeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const icon = modeToggleBtn.querySelector('i');
  if(document.body.classList.contains('dark-mode')) {
    icon.className = "fas fa-sun";
  } else {
    icon.className = "fas fa-moon";
  }
});

// --- Gráficos Chart.js ---
const treeCoverageChartCtx = document.getElementById('chartTrees').getContext('2d');
const biodiversityChartCtx = document.getElementById('chartBiodiversity').getContext('2d');

const treeCoverageChart = new Chart(treeCoverageChartCtx, {
  type: 'bar',
  data: {
    labels: Object.values(countriesData).map(c => c.name),
    datasets: [{
      label: 'Cobertura de Árvores (%)',
      data: Object.values(countriesData).map(c => c.treeCoverage),
      backgroundColor: 'rgba(34,139,34,0.6)',
      borderColor: 'rgba(34,139,34,1)',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true, max: 100 }
    }
  }
});

const biodiversityChart = new Chart(biodiversityChartCtx, {
  type: 'line',
  data: {
    labels: Object.values(countriesData).map(c => c.name),
    datasets: [{
      label: 'Índice de Biodiversidade',
      data: Object.values(countriesData).map(c => c.biodiversityIndex),
      borderColor: 'rgba(70,130,180,1)',
      backgroundColor: 'rgba(70,130,180,0.3)',
      fill: true,
      tension: 0.3,
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true, max: 100 }
    }
  }
});

// --- Atualizar gráficos para um país selecionado (pode personalizar se quiser) ---
function updateCharts(country) {
  // Por enquanto só atualiza o título dos gráficos (podemos melhorar)
  // Pode implementar gráficos dinâmicos aqui!
}

// --- Inicialização ---
populateGlobalSpecies();
