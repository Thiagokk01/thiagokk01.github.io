// EcoTracker PRO - Script principal
// Responsável pelo mapa, gráficos, filtros, modo claro/escuro, legenda e interação

document.addEventListener('DOMContentLoaded', () => {
  let map, countryLayer;
  let currentCountry = null;

  // Dados simulados para 5 países, valores para os últimos 5 anos (2021 a 2025)
  const countriesData = {
    Brazil: {
      co2: [1500, 1400, 1300, 1200, 1100],
      trees: [5000, 5200, 5300, 5400, 5500],
      biodiversity: [2000, 2100, 2200, 2300, 2400],
    },
    USA: {
      co2: [5000, 4900, 4800, 4700, 4600],
      trees: [3000, 3100, 3200, 3300, 3400],
      biodiversity: [1500, 1400, 1300, 1200, 1100],
    },
    Canada: {
      co2: [1000, 980, 960, 940, 920],
      trees: [6000, 6100, 6200, 6300, 6400],
      biodiversity: [800, 850, 900, 950, 1000],
    },
    India: {
      co2: [2000, 1900, 1850, 1800, 1750],
      trees: [2500, 2600, 2700, 2800, 2900],
      biodiversity: [900, 920, 940, 960, 980],
    },
    Australia: {
      co2: [800, 780, 770, 760, 750],
      trees: [1500, 1520, 1530, 1540, 1550],
      biodiversity: [700, 710, 720, 730, 740],
    },
  };

  // Espécies ameaçadas simuladas
  const threatenedSpecies = [
    {
      name: 'Tigre-da-bengala',
      scientific: 'Panthera tigris tigris',
      status: 'Criticamente em perigo',
      region: 'Ásia',
      color: '#d9534f',
    },
    {
      name: 'Tartaruga-de-couro',
      scientific: 'Dermochelys coriacea',
      status: 'Vulnerável',
      region: 'Oceanos',
      color: '#f0ad4e',
    },
    {
      name: 'Arara-azul',
      scientific: 'Anodorhynchus hyacinthinus',
      status: 'Em perigo',
      region: 'América do Sul',
      color: '#d9534f',
    },
    {
      name: 'Panda Gigante',
      scientific: 'Ailuropoda melanoleuca',
      status: 'Vulnerável',
      region: 'China',
      color: '#f0ad4e',
    },
    {
      name: 'Elefante Africano',
      scientific: 'Loxodonta africana',
      status: 'Vulnerável',
      region: 'África',
      color: '#f0ad4e',
    },
  ];

  // Anos para gráficos
  const years = ['2021', '2022', '2023', '2024', '2025'];

  // Inicializa o mapa Leaflet
  function initMap() {
    map = L.map('map').setView([-15, -55], 3);

    // OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 6,
      minZoom: 2,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Simples camada para países (simulada)
    // Para simplificar, vamos usar marcadores para representar países
    Object.keys(countriesData).forEach((country) => {
      let coords = getCountryCoords(country);
      if (!coords) return;

      let marker = L.circleMarker(coords, {
        radius: 12,
        fillColor: '#27ae60',
        color: '#145214',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7,
      }).addTo(map);

      marker.bindTooltip(country, { permanent: false, direction: 'top' });

      marker.on('click', () => {
        selectCountry(country);
      });
    });
  }

  // Coordenadas aproximadas dos países no mapa
  function getCountryCoords(country) {
    const coordsMap = {
      Brazil: [-14.235, -51.9253],
      USA: [37.0902, -95.7129],
      Canada: [56.1304, -106.3468],
      India: [20.5937, 78.9629],
      Australia: [-25.2744, 133.7751],
    };
    return coordsMap[country] || null;
  }

  // Função para atualizar dados quando um país é selecionado
  function selectCountry(country) {
    currentCountry = country;
    const data = countriesData[country];

    // Atualiza nome do país
    const countryNameEl = document.getElementById('country-name');
    countryNameEl.textContent = `Dados para ${country}`;

    // Atualiza lista de espécies ameaçadas para o país selecionado
    updateSpeciesList(country);

    // Atualiza gráficos
    updateCharts(data);
  }

  // Atualiza a lista de espécies ameaçadas filtrando pela região do país
  function updateSpeciesList(country) {
    // Mapear país para região para filtro
    const regionMap = {
      Brazil: 'América do Sul',
      USA: 'América do Norte',
      Canada: 'América do Norte',
      India: 'Ásia',
      Australia: 'Oceania',
    };

    const region = regionMap[country] || '';

    const speciesContainer = document.getElementById('species-list');
    speciesContainer.innerHTML = ''; // limpa

    const filtered = threatenedSpecies.filter(
      (sp) => sp.region === region || sp.region === country
    );

    if (filtered.length === 0) {
      speciesContainer.innerHTML = '<p>Sem espécies ameaçadas cadastradas para este país.</p>';
      return;
    }

    filtered.forEach((sp) => {
      const div = document.createElement('div');
      div.classList.add('species-item');
      div.innerHTML = `
        <div class="species-name">${sp.name}</div>
        <div class="species-scientific">${sp.scientific}</div>
        <div class="species-status" style="color: ${sp.color}">${sp.status}</div>
      `;
      speciesContainer.appendChild(div);
    });
  }

  // Inicializa os gráficos Chart.js
  let chartCo2, chartTrees, chartBiodiversity;
  function initCharts() {
    const ctxCo2 = document.getElementById('chartCo2').getContext('2d');
    const ctxTrees = document.getElementById('chartTrees').getContext('2d');
    const ctxBio = document.getElementById('chartBiodiversity').getContext('2d');

    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true },
      },
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'index', intersect: false },
      },
    };

    chartCo2 = new Chart(ctxCo2, {
      type: 'line',
      data: {
        labels: years,
        datasets: [{
          label: 'CO₂ (toneladas)',
          data: [],
          borderColor: '#27ae60',
          backgroundColor: 'rgba(39, 174, 96, 0.3)',
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
        }],
      },
      options: commonOptions,
    });

    chartTrees = new Chart(ctxTrees, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [{
          label: 'Árvores',
          data: [],
          backgroundColor: '#558b2f',
        }],
      },
      options: commonOptions,
    });

    chartBiodiversity = new Chart(ctxBio, {
      type: 'line',
      data: {
        labels: years,
        datasets: [{
          label: 'Biodiversidade',
          data: [],
          borderColor: '#c27ba0',
          backgroundColor: 'rgba(194, 123, 160, 0.3)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        }],
      },
      options: commonOptions,
    });
  }

  // Atualiza os gráficos com dados do país selecionado
  function updateCharts(data) {
    if (!data) return;

    chartCo2.data.datasets[0].data = data.co2;
    chartTrees.data.datasets[0].data = data.trees;
    chartBiodiversity.data.datasets[0].data = data.biodiversity;

    chartCo2.update();
    chartTrees.update();
    chartBiodiversity.update();
  }

  // Filtro da busca de países
  const searchCountryInput = document.getElementById('search-country');
  searchCountryInput.addEventListener('input', () => {
    const val = searchCountryInput.value.trim().toLowerCase();
    if (!val) return;

    // Se existe o país com esse nome (início ou completo), seleciona ele
    const matched = Object.keys(countriesData).find((c) =>
      c.toLowerCase().startsWith(val)
    );
    if (matched) {
      selectCountry(matched);
    }
  });

  // Filtro da busca de espécies
  const searchSpeciesInput = document.getElementById('search-species');
  searchSpeciesInput.addEventListener('input', () => {
    const val = searchSpeciesInput.value.trim().toLowerCase();
    const speciesContainer = document.getElementById('species-list');
    speciesContainer.innerHTML = '';

    if (!val) {
      speciesContainer.innerHTML = '<p>Digite para buscar espécies...</p>';
      return;
    }

    const filtered = threatenedSpecies.filter(
      (sp) =>
        sp.name.toLowerCase().includes(val) ||
        sp.scientific.toLowerCase().includes(val) ||
        sp.status.toLowerCase().includes(val)
    );

    if (filtered.length === 0) {
      speciesContainer.innerHTML = '<p>Nenhuma espécie encontrada.</p>';
      return;
    }

    filtered.forEach((sp) => {
      const div = document.createElement('div');
      div.classList.add('species-item');
      div.innerHTML = `
        <div class="species-name">${sp.name}</div>
        <div class="species-scientific">${sp.scientific}</div>
        <div class="species-status" style="color: ${sp.color}">${sp.status}</div>
      `;
      speciesContainer.appendChild(div);
    });
  });

  // Modo claro / escuro
  const modeToggleBtn = document.getElementById('mode-toggle');
  modeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = modeToggleBtn.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  });

  // Legenda para o mapa
  function createLegend() {
    const legend = document.getElementById('legend');
    legend.innerHTML = `
      <h4>Legenda do Mapa</h4>
      <div><span style="background:#27ae60;"></span>Países monitorados</div>
      <div><span style="background:#d9534f;"></span>Espécies Criticamente em perigo</div>
      <div><span style="background:#f0ad4e;"></span>Espécies Vulneráveis</div>
      <div><span style="background:#ffeb3b;"></span>Espécies Em perigo</div>
    `;
  }

  // Inicializa tudo
  function init() {
    initMap();
    initCharts();
    createLegend();
  }

  init();
});
