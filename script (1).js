const endangeredSpecies = [
  {
    "name": "Tigre",
    "scientific": "Panthera tigris",
    "status": "Em Perigo",
    "region": "Ásia",
    "color": "#d32f2f"
  },
  {
    "name": "Elefante-Africano",
    "scientific": "Loxodonta africana",
    "status": "Vulnerável",
    "region": "África",
    "color": "#f57c00"
  },
  {
    "name": "Urso Polar",
    "scientific": "Ursus maritimus",
    "status": "Vulnerável",
    "region": "Ártico",
    "color": "#0288d1"
  },
  {
    "name": "Panda Gigante",
    "scientific": "Ailuropoda melanoleuca",
    "status": "Vulnerável",
    "region": "China",
    "color": "#7b1fa2"
  },
  {
    "name": "Arraia Manta",
    "scientific": "Mobula birostris",
    "status": "Em Perigo",
    "region": "Oceania",
    "color": "#00796b"
  }
];

function renderEndangeredSpecies() {
  const container = document.createElement('section');
  container.className = 'card card-species';
  container.innerHTML = `
    <div class="card-header">
      <h2 class="card-title"><i class="fas fa-exclamation-triangle"></i> Espécies Ameaçadas Globalmente</h2>
    </div>
  `;
  const list = document.createElement('div');
  list.className = 'species-list';
  endangeredSpecies.forEach(species => {
    const item = document.createElement('div');
    item.className = 'species-item';
    item.innerHTML = `
      <div class="species-name">${species.name}</div>
      <div class="species-scientific">${species.scientific}</div>
      <div class="species-status" style="color:${species.color};">${species.status} - ${species.region}</div>
    `;
    list.appendChild(item);
  });
  container.appendChild(list);
  document.getElementById('species-endangered').appendChild(container);
}

document.addEventListener('DOMContentLoaded', function () {
  renderEndangeredSpecies();
});
