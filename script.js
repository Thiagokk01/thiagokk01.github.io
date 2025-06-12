document.addEventListener('DOMContentLoaded', () => {
  // Dados simulados
  const countriesData = {
    Brazil: {
      co2: [500, 480, 460, 440, 420],
      trees: [1200, 1250, 1300, 1400, 1500],
      biodiversity: [80, 82, 85, 87, 90],
    },
    USA: {
      co2: [600, 590, 580, 570, 560],
      trees: [900, 920, 930, 940, 950],
      biodiversity: [70, 71, 72, 74, 75],
    },
    Canada: {
      co2: [300, 295, 290, 285, 280],
      trees: [1000, 1050, 1075, 1100, 1125],
      biodiversity: [75, 77, 78, 80, 82],
    },
    India: {
      co2: [700, 710, 720, 730, 740],
      trees: [600, 620, 650, 670, 690],
      biodiversity: [65, 66, 67, 68, 69],
    },
    Australia: {
      co2: [400, 390, 380, 370, 360],
      trees: [500, 520, 530, 540, 550],
      biodiversity: [68, 70, 72, 73, 75],
    },
  };

  const threatenedSpecies = [
    {
      name: 'Onça-pintada',
      scientific: 'Panthera onca',
      status: 'Vulnerável',
      region: 'América do Sul',
      color: '#f0ad4e',
    },
    {
      name: 'Arara-azul',
      scientific: 'Anodorhynchus hyacinthinus',
      status: 'Em perigo',
      region: 'América do Sul',
      color: '#ffeb3b',
    },
    {
      name: 'Tigre-de-bengala',
      scientific: 'Panthera tigris tigris',
      status: 'Em perigo',
      region: 'Ásia',
      color: '#ffeb3b',
    },
    {
      name: 'Panda Gigante',
      scientific: 'Ailuropoda melanoleuca',
      status: 'Vulnerável',
      region: 'Ásia',
      color: '#f0ad4e',
    },
    {
      name: 'Canguru-vermelho',
      scientific: 'Macropus rufus',
      status: 'Em perigo',
      region: 'Oceania',
      color: '#ffeb3b',
    },
    {
      name: 'Águia-careca',
      scientific: 'Haliaeetus leucocephalus',
      status: 'Vulnerável',
      region: 'América do Norte',
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

  const years = ['2021', '2022', '2023', '2024', '2025'];

  let map;
  let currentCountry = null;

  function initMap() {
    map = L.map('map').setView([-15, -55], 3);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 6,
      minZoom: 2,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

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

  function selectCountry(country) {
    currentCountry = country;
    const data = countriesData[country];

    const countryNameEl = document.getElementById('country-name');
    countryNameEl.textContent = `Dados para ${country}`;

    updateSpeciesList(country);
    updateCharts(data);
  }

  function updateSpeciesList(country) {
    const regionMap = {
      Brazil: 'América do Sul',
      USA: 'América do Norte',
      Canada: 'América do Norte',
      India: 'Ásia',
      Australia: 'Oceania',
    };

    const region = regionMap[country] || '';

    const speciesContainer = document.getElementById('species-list');
    speciesContainer.innerHTML = '';

    const filtered = threatenedSpecies.filter(
      (sp) => sp.region === region || sp.region === country
    );

    if (filtered.length === 0) {
      speciesContainer.innerHTML =
        '<p>Sem espécies ameaçadas cadastradas para este país.</p>';
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
        datasets: [
          {
            label: 'CO₂ (toneladas)',
            data: [],
            borderColor: '#27ae60',
            backgroundColor: 'rgba(39, 174, 96, 0.3)',
            fill: true,
            tension: 0.3,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: commonOptions,
    });

    chartTrees = new Chart(ctxTrees, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Árvores',
            data: [],
            backgroundColor: '#558b2f',
          },
        ],
      },
      options: commonOptions,
    });

    chartBiodiversity = new Chart(ctxBio, {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Biodiversidade',
            data: [],
            borderColor: '#c27ba0',
            backgroundColor: 'rgba(194, 123, 160, 0.3)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: commonOptions,
    });
  }

  function updateCharts(data) {
    if (!data) return;

    chartCo2.data.datasets[0].data = data.co2;
    chartTrees.data.datasets[0].data = data.trees;
    chartBiodiversity.data.datasets[0].data = data.biodiversity;

    chartCo2.update();
    chartTrees.update();
    chartBiodiversity.update();
  }

  const searchCountryInput = document.getElementById('search-country');
  searchCountryInput.addEventListener('input', () => {
    const val = searchCountryInput.value.trim().toLowerCase();
    if (!val) return;

    const matched = Object.keys(countriesData).find((c) =>
      c.toLowerCase().startsWith(val)
    );
    if (matched) {
      selectCountry(matched);
    }
  });

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

  // Inicialização
  initMap();
  initCharts();
});
