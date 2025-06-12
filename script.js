// Dados simulados (exemplo simples)
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
    attribution:
      '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // Marca países
  countriesData.forEach((country) => {
    const marker = L.circleMarker(country.latlng, {
      radius: 10,
      fillColor: "#2e8b57",
      color: "#1b4d3e",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8,
      cursor: "pointer",
    })
      .addTo(map)
      .bindTooltip(country.name)
      .on("click", () => selectCountry(country));

    markers.push(marker);
  });
}

function selectCountry(country) {
  currentCountry = country;

  // Centraliza o mapa no país selecionado
  map.setView(country.latlng, 5);

  // Atualiza sidebar com informações do país
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
  const ctxCo2 = document.getElementById("chartCo2").getContext("2d");
  chartCo2 = new Chart(ctxCo2, {
    type: "bar",
    data: {
      labels: countriesData.map((c) => c.name),
      datasets: [
        {
          label: "Emissão CO₂ (milhões de toneladas)",
          data: countriesData.map((c) => c.co2),
          backgroundColor: "#27ae60",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  const ctxTrees = document.getElementById("chartTrees").getContext("2d");
  chartTrees = new Chart(ctxTrees, {
    type: "line",
    data: {
      labels: countriesData.map((c) => c.name),
      datasets: [
        {
          label: "Cobertura de árvores (milhões ha)",
          data: countriesData.map((c) => c.trees),
          backgroundColor: "rgba(46,139,87,0.5)",
          borderColor: "#2e8b57",
          fill: true,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: {
        y: { beginAtZero: true },
      },
    },
  });

  const ctxBio = document.getElementById("chartBiodiversity").getContext("2d");
  chartBiodiversity = new Chart(ctxBio, {
    type: "radar",
    data: {
      labels: countriesData.map((c) => c.name),
      datasets: [
        {
          label: "Índice de biodiversidade",
          data: countriesData.map((c) => c.biodiversity),
          backgroundColor: "rgba(39,174,96,0.4)",
          borderColor: "#27ae60",
          pointBackgroundColor: "#27ae60",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        r: {
          beginAtZero: true,
        },
      },
    },
  });
}

function updateCharts(country) {
  // Aqui atualizo os gráficos com destaque para o país selecionado (simples)

  // Exemplo: destacar país no gráfico CO2
  if (!chartCo2) return;

  // Podemos atualizar os datasets se quiser, mas para exemplo só deixo fixo
}

function setupSearch() {
  const inputCountry = document.getElementById("search-country");
  const inputSpecies = document.getElementById("search-species");

  inputCountry.addEventListener("input", () => {
    const query = inputCountry.value.toLowerCase();

    // Filtra marcadores no mapa
    markers.forEach((marker, i) => {
      const countryName = countriesData[i].name.toLowerCase();
      if (countryName.includes(query)) {
        marker.addTo(map);
      } else {
        map.removeLayer(marker);
      }
    });
  });

  inputSpecies.addEventListener("input", () => {
    const query = inputSpecies.value.toLowerCase();

    // Filtra países que possuem espécies com nome ou status que contenha query
    const filteredCountries = countriesData.filter((country) =>
      country.species.some(
        (sp) =>
          sp.name.toLowerCase().includes(query) ||
          sp.status.toLowerCase().includes(query)
      )
    );

    // Atualiza marcadores no mapa para mostrar só países filtrados
    markers.forEach((marker, i) => {
      if (filteredCountries.includes(countriesData[i])) {
        marker.addTo(map);
      } else {
        map.removeLayer(marker);
      }
    });
  });
}

function setupDarkMode() {
  const btn = document.getElementById("mode-toggle");
  const icon = btn.querySelector("i");

  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    } else {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
    }
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

  statuses.forEach((status) => {
    const div = document.createElement("div");
    div.className = "legend-item";
    div.innerHTML = `
      <div class="legend-color" style="background-color: ${status.color};"></div>
      <span>${status.label}</span>
    `;
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
