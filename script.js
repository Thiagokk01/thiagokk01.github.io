// script.js - EcoTracker PRO

// Global variables e referências DOM
const mapContainer = document.getElementById('map');
const regiaoSelect = document.getElementById('regiao');
const tipoVisualizacaoSelect = document.getElementById('tipoVisualizacao');
const dataInicioInput = document.getElementById('dataInicio');
const dataFimInput = document.getElementById('dataFim');
const buscarDadosBtn = document.getElementById('buscarDados');
const buttonText = document.getElementById('buttonText');
const buttonLoading = document.getElementById('buttonLoading');

const treeCountEl = document.getElementById('tree-count');
const speciesCountEl = document.getElementById('species-count');
const co2CountEl = document.getElementById('co2-count');

const speciesSearchInput = document.getElementById('speciesSearch');
const speciesListEl = document.getElementById('speciesList');
const viewAllBtn = document.getElementById('view-all');

const updateTimeEl = document.getElementById('update-time');

const co2ChartCanvas = document.getElementById('co2Chart').getContext('2d');
const speciesChartCanvas = document.getElementById('speciesChart').getContext('2d');

let map, markerClusterGroup, heatLayer;
let speciesData = []; // Array para guardar as espécies
let markers = []; // Marcadores do mapa

// Charts Chart.js
let co2Chart, speciesChart;

// Função para inicializar o mapa Leaflet
function initMap() {
  map = L.map('map').setView([-15.7942, -47.8822], 4); // Brasília, Brasil como centro inicial

  // TileLayer OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // Inicializa cluster group
  markerClusterGroup = L.markerClusterGroup();
  map.addLayer(markerClusterGroup);
}

// Função para limpar marcadores do mapa
function clearMarkers() {
  markerClusterGroup.clearLayers();
  markers = [];
  if (heatLayer) {
    map.removeLayer(heatLayer);
    heatLayer = null;
  }
}

// Função para atualizar estatísticas (árvores, espécies, CO2)
function updateStatistics(data) {
  // Simulação: soma valores da resposta
  let totalTrees = 0;
  let totalSpecies = new Set();
  let totalCO2 = 0;

  data.forEach((item) => {
    totalTrees += item.treesPlanted || 0;
    if (item.species) totalSpecies.add(item.species);
    totalCO2 += item.co2Reduced || 0;
  });

  // Animações dos números com CountUp.js
  const treeCount = new CountUp('tree-count', totalTrees, { duration: 2 });
  const speciesCount = new CountUp('species-count', totalSpecies.size, {
    duration: 2,
  });
  const co2Count = new CountUp('co2-count', totalCO2.toFixed(2), {
    duration: 2,
    decimalPlaces: 2,
  });

  treeCount.start();
  speciesCount.start();
  co2Count.start();
}

// Função para criar marcadores no mapa baseado nos dados
function createMarkers(data) {
  clearMarkers();

  data.forEach((item) => {
    if (!item.lat || !item.lng) return;

    const marker = L.marker([item.lat, item.lng]);
    marker.bindPopup(
      `<b>Espécie:</b> ${item.species}<br/>
      <b>Árvores plantadas:</b> ${item.treesPlanted}<br/>
      <b>CO₂ reduzido:</b> ${item.co2Reduced.toFixed(2)} t`
    );
    markerClusterGroup.addLayer(marker);
    markers.push(marker);
  });
}

// Função para criar heatmap (simulação, pode usar plugin real de heatmap se quiser)
function createHeatmap(data) {
  clearMarkers();
  // Para simplificar, vamos criar pontos com peso para heatLayer

  const heatPoints = data
    .filter((d) => d.lat && d.lng && d.co2Reduced)
    .map((d) => [d.lat, d.lng, d.co2Reduced]);

  // Usar plugin leaflet.heat (precisa ser incluído externamente)
  // Aqui é exemplo: heatLayer = L.heatLayer(heatPoints).addTo(map);

  // Como não incluímos o plugin, vamos apenas criar marcadores coloridos pelo co2Reduced

  data.forEach((item) => {
    if (!item.lat || !item.lng) return;
    const intensity = Math.min(item.co2Reduced / 10, 1); // normalizar
    const color = `rgba(255, 0, 0, ${intensity})`;
    const circle = L.circleMarker([item.lat, item.lng], {
      radius: 10,
      fillColor: color,
      fillOpacity: 0.6,
      color: '#f03',
      weight: 1,
    }).addTo(map);

    circle.bindPopup(
      `<b>Espécie:</b> ${item.species}<br/>
      <b>Árvores plantadas:</b> ${item.treesPlanted}<br/>
      <b>CO₂ reduzido:</b> ${item.co2Reduced.toFixed(2)} t`
    );

    markers.push(circle);
  });
}

// Função para atualizar gráficos Chart.js
function updateCharts(data) {
  // Exemplo: dados para gráfico de CO2 por espécie
  const speciesMap = new Map();
  data.forEach((item) => {
    if (!item.species) return;
    speciesMap.set(
      item.species,
      (speciesMap.get(item.species) || 0) + (item.co2Reduced || 0)
    );
  });

  const speciesNames = [...speciesMap.keys()];
  const co2Values = [...speciesMap.values()];

  // Atualiza gráfico CO2
  if (co2Chart) co2Chart.destroy();
  co2Chart = new Chart(co2ChartCanvas, {
    type: 'bar',
    data: {
      labels: speciesNames,
      datasets: [
        {
          label: 'CO₂ Reduzido (t)',
          data: co2Values,
          backgroundColor: 'rgba(46, 139, 87, 0.7)',
          borderColor: 'rgba(46, 139, 87, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true },
      },
    },
  });

  // Gráfico de espécies (quantidade de árvores por espécie)
  const speciesTreesMap = new Map();
  data.forEach((item) => {
    if (!item.species) return;
    speciesTreesMap.set(
      item.species,
      (speciesTreesMap.get(item.species) || 0) + (item.treesPlanted || 0)
    );
  });

  const speciesTreesNames = [...speciesTreesMap.keys()];
  const treesValues = [...speciesTreesMap.values()];

  if (speciesChart) speciesChart.destroy();
  speciesChart = new Chart(speciesChartCanvas, {
    type: 'pie',
    data: {
      labels: speciesTreesNames,
      datasets: [
        {
          label: 'Árvores Plantadas',
          data: treesValues,
          backgroundColor: speciesTreesNames.map(
            (_, i) => `hsl(${(i * 360) / speciesTreesNames.length}, 70%, 60%)`
          ),
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
}

// Função para mostrar lista de espécies no painel lateral
function showSpeciesList(data) {
  speciesListEl.innerHTML = '';
  speciesData = data;

  data.forEach((item) => {
    const div = document.createElement('div');
    div.textContent = `${item.species} - Árvores: ${item.treesPlanted}`;
    div.title = `Espécie: ${item.species}\nÁrvores plantadas: ${item.treesPlanted}\nCO₂ reduzido: ${item.co2Reduced.toFixed(2)} t`;
    div.addEventListener('click', () => {
      if (item.lat && item.lng) {
        map.setView([item.lat, item.lng], 12);
      }
    });
    speciesListEl.appendChild(div);
  });
}

// Função para filtrar espécies na lista pelo texto de busca
function filterSpeciesList() {
  const query = speciesSearchInput.value.toLowerCase();
  const filtered = speciesData.filter((item) =>
    item.species.toLowerCase().includes(query)
  );
  showSpeciesList(filtered);
}

// Função para carregar dados simulados ou reais
async function fetchData() {
  // Aqui você pode fazer fetch() para uma API real
  // Por enquanto, dados simulados:
  return [
    {
      species: 'Araucária',
      lat: -25.5,
      lng: -49.3,
      treesPlanted: 1200,
      co2Reduced: 540,
    },
    {
      species: 'Ipê Amarelo',
      lat: -22.9,
      lng: -43.2,
      treesPlanted: 800,
      co2Reduced: 320,
    },
    {
      species: 'Jacarandá',
      lat: -23.5,
      lng: -46.6,
      treesPlanted: 600,
      co2Reduced: 250,
    },
    {
      species: 'Pau-Brasil',
      lat: -15.8,
      lng: -47.9,
      treesPlanted: 1000,
      co2Reduced: 460,
    },
    {
      species: 'Ipê Roxo',
      lat: -19.9,
      lng: -43.9,
      treesPlanted: 500,
      co2Reduced: 220,
    },
  ];
}

// Função para atualizar tudo ao clicar no botão
async function updateAll() {
  // Desabilita botão e mostra loading
  buscarDadosBtn.disabled = true;
  buttonText.style.display = 'none';
  buttonLoading.style.display = 'inline-block';

  try {
    // Busca dados - pode adicionar filtro por data e região aqui
    const data = await fetchData();

    // Filtrar dados por região, data ou visualização
    // Para exemplo, vamos ignorar filtros regionais

    // Atualiza mapa conforme visualização selecionada
    if (tipoVisualizacaoSelect.value === 'cluster') {
      createMarkers(data);
    } else if (tipoVisualizacaoSelect.value === 'heatmap') {
      createHeatmap(data);
    } else if (tipoVisualizacaoSelect.value === 'pontos') {
      createMarkers(data);
    }

    // Atualiza estatísticas, gráficos e lista
    updateStatistics(data);
    updateCharts(data);
    showSpeciesList(data);

    // Atualiza hora da última atualização
    const now = new Date();
    updateTimeEl.textContent = now.toLocaleString();
  } catch (error) {
    alert('Erro ao carregar dados: ' + error);
  } finally {
    // Reabilita botão e esconde loading
    buscarDadosBtn.disabled = false;
    buttonText.style.display = 'inline';
    buttonLoading.style.display = 'none';
  }
}

// Event listeners
buscarDadosBtn.addEventListener('click', updateAll);
speciesSearchInput.addEventListener('input', filterSpeciesList);
viewAllBtn.addEventListener('click', () => showSpeciesList(speciesData));
regiaoSelect.addEventListener('change', updateAll);
tipoVisualizacaoSelect.addEventListener('change', updateAll);
dataInicioInput.addEventListener('change', updateAll);
dataFimInput.addEventListener('change', updateAll);

// Inicialização
initMap();
updateAll();
