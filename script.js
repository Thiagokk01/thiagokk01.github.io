document.addEventListener("DOMContentLoaded", () => {
  // Inicializar mapa Leaflet
  const map = L.map("map").setView([-15, -55], 4); // Centro aproximado do Brasil

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contribuidores',
  }).addTo(map);

  // Exemplo de países com marcador
  const countries = [
    { name: "Brasil", coords: [-15, -47], co2: 150, trees: 8000, biodiversity: 85 },
    { name: "Argentina", coords: [-34, -64], co2: 90, trees: 4200, biodiversity: 70 },
    { name: "Chile", coords: [-33, -70], co2: 60, trees: 3600, biodiversity: 55 },
    { name: "Peru", coords: [-9, -75], co2: 45, trees: 2900, biodiversity: 60 }
  ];

  countries.forEach(c => {
    L.circleMarker(c.coords, {
      radius: 8,
      color: "#2e7d32",
      fillColor: "#66bb6a",
      fillOpacity: 0.8
    })
      .addTo(map)
      .bindPopup(`<strong>${c.name}</strong><br>CO₂: ${c.co2}<br>Árvores: ${c.trees}<br>Biodiversidade: ${c.biodiversity}`);
  });

  // Agora carregue os gráficos normalmente abaixo…
  const countryNames = countries.map(c => c.name);
  const co2Data = countries.map(c => c.co2);
  const treesData = countries.map(c => c.trees);
  const treesNextYear = treesData.map(t => Math.round(t * 1.1));
  const biodiversityData = countries.map(c => c.biodiversity);

  // [continua com os gráficos aqui, igual antes...]

  // Configuração global do Chart.js
  Chart.defaults.animation.duration = 1000;
  Chart.defaults.animation.easing = 'easeInOutQuart';
  Chart.defaults.responsive = true;

  // Gráfico de CO2
  new Chart(document.getElementById("chartCo2"), {
    type: "bar",
    data: {
      labels: countries,
      datasets: [{
        label: "Emissão CO₂ (milhões t)",
        data: co2Data,
        backgroundColor: "#27ae60",
      }]
    },
    options: {
      responsive: true,
      animation: {
        duration: 1500,
        easing: "easeInOutQuart"
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Milhões de toneladas" } },
        x: { title: { display: true, text: "Países" } }
      }
    }
  });

  // Gráfico de Árvores
  new Chart(document.getElementById("chartTrees"), {
    type: "line",
    data: {
      labels: countries,
      datasets: [
        {
          label: "Árvores (total atual)",
          data: treesData,
          borderColor: "#2e8b57",
          backgroundColor: "rgba(46,139,87,0.5)",
          fill: true,
          tension: 0.3
        },
        {
          label: "Árvores (ano seguinte)",
          data: treesNextYear,
          borderColor: "#145214",
          backgroundColor: "rgba(20,82,20,0.3)",
          fill: true,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      animation: {
        duration: 1800,
        easing: "easeInOutQuart"
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Quantidade de árvores" } },
        x: { title: { display: true, text: "Países" } }
      }
    }
  });

  // Gráfico de Biodiversidade
  new Chart(document.getElementById("chartBiodiversity"), {
    type: "radar",
    data: {
      labels: countries,
      datasets: [{
        label: "Índice de Biodiversidade",
        data: biodiversityData,
        backgroundColor: "rgba(39,174,96,0.4)",
        borderColor: "#27ae60"
      }]
    },
    options: {
      responsive: true,
      animation: {
        duration: 1200,
        easing: "easeInOutQuart"
      },
      scales: {
        r: {
          beginAtZero: true,
          pointLabels: {
            font: { size: 14 }
          }
        }
      }
    }
  });
});
