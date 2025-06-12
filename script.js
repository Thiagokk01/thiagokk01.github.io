document.addEventListener("DOMContentLoaded", () => {
  // Dados
  const countries = ["Brasil", "Argentina", "Chile", "Peru"];
  const co2Data = [150, 90, 60, 45];
  const treesData = [8000, 4200, 3600, 2900];
  const treesNextYear = treesData.map(t => Math.round(t * 1.1));
  const biodiversityData = [85, 70, 55, 60];

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
