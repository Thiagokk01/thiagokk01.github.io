// Configurações avançadas
const config = {
    regions: {
        'global': { 
            center: [20, 0], 
            zoom: 2, 
            color: '#2e8b57',
            gradient: { 
                0.4: '#2e8b57', 
                0.6: '#ffd700', 
                1.0: '#ff4500' 
            }
        },
        'america-sul': { 
            center: [-15, -60], 
            zoom: 4, 
            color: '#3cb371',
            gradient: { 
                0.4: '#3cb371', 
                0.6: '#ffd700', 
                1.0: '#ff4500' 
            }
        },
        'america-norte': { 
            center: [40, -100], 
            zoom: 3, 
            color: '#4c956c',
            gradient: { 
                0.4: '#4c956c', 
                0.6: '#ffd700', 
                1.0: '#ff4500' 
            }
        },
        'europa': { 
            center: [50, 15], 
            zoom: 4, 
            color: '#5aa57e',
            gradient: { 
                0.4: '#5aa57e', 
                0.6: '#ffd700', 
                1.0: '#ff4500' 
            }
        },
        'asia': { 
            center: [30, 100], 
            zoom: 3, 
            color: '#6ab58f',
            gradient: { 
                0.4: '#6ab58f', 
                0.6: '#ffd700', 
                1.0: '#ff4500' 
            }
        },
        'africa': { 
            center: [0, 20], 
            zoom: 3, 
            color: '#7ac5a0',
            gradient: { 
                0.4: '#7ac5a0', 
                0.6: '#ffd700', 
                1.0: '#ff4500' 
            }
        },
        'oceania': { 
            center: [-25, 135], 
            zoom: 3, 
            color: '#8ad5b1',
            gradient: { 
                0.4: '#8ad5b1', 
                0.6: '#ffd700', 
                1.0: '#ff4500' 
            }
        }
    },
    species: [
        { name: "Ipê Amarelo", scientific: "Tabebuia chrysotricha", percent: 32, color: '#FFD700' },
        { name: "Pau Brasil", scientific: "Paubrasilia echinata", percent: 18, color: '#2e8b57' },
        { name: "Araucária", scientific: "Araucaria angustifolia", percent: 15, color: '#8B4513' },
        { name: "Jatobá", scientific: "Hymenaea courbaril", percent: 12, color: '#A0522D' },
        { name: "Cedro", scientific: "Cedrela fissilis", percent: 10, color: '#556B2F' },
        { name: "Mogno", scientific: "Swietenia macrophylla", percent: 8, color: '#8B0000' },
        { name: "Angico", scientific: "Anadenanthera colubrina", percent: 5, color: '#9932CC' }
    ],
    co2PerTree: 22.5, // kg/ano
    oxygenPerTree: 118, // kg/ano
    coolingPer1000Trees: 0.015, // °C em 10 anos
    historicalData: {
        '2023-01': { trees: 120000, species: 45, co2: 2700, oxygen: 14160 },
        '2023-06': { trees: 250000, species: 62, co2: 5625, oxygen: 29500 },
        '2024-01': { trees: 450000, species: 78, co2: 10125, oxygen: 53100 },
        '2024-06': { trees: 680000, species: 85, co2: 15300, oxygen: 80240 },
        '2025-01': { trees: 920000, species: 92, co2: 20700, oxygen: 108560 }
    }
};

// Inicialização do Mapa
const map = L.map('map', {
    zoomControl: false,
    attributionControl: false
}).setView([20, 0], 2);

// Camada base personalizada
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    detectRetina: true
}).addTo(map);

// Controles personalizados
L.control.zoom({
    position: 'topright'
}).addTo(map);

// Variáveis globais
let markers = [];
let markerCluster = null;
let heatLayer = null;
let countUpInstances = {};
let co2Chart = null;
let tempChart = null;
let speciesChart = null;
let currentRegion = 'global';
let currentView = 'heatmap';
let currentDate = new Date().toISOString().split('T')[0];
let dateRange = {
    start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0],
    end: currentDate
};

// Inicialização dos gráficos
function initCharts() {
    const co2Ctx = document.getElementById('co2Chart').getContext('2d');
    const speciesCtx = document.getElementById('speciesChart').getContext('2d');
    
    co2Chart = new Chart(co2Ctx, {
        type: 'line',
        data: {
            labels: Object.keys(config.historicalData),
            datasets: [{
                label: 'Árvores Plantadas',
                data: Object.values(config.historicalData).map(d => d.trees / 1000),
                borderColor: config.regions[currentRegion].color,
                backgroundColor: `${config.regions[currentRegion].color}20`,
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                yAxisID: 'y'
            }, {
                label: 'Espécies Diferentes',
                data: Object.values(config.historicalData).map(d => d.species),
                borderColor: '#FFD700',
                backgroundColor: '#FFD70020',
                borderWidth: 2,
                tension: 0.3,
                fill: false,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.datasetIndex === 0) {
                                label += `${context.raw.toFixed(1)} mil`;
                            } else {
                                label += context.raw;
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Árvores (mil)',
                        color: '#666'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Espécies',
                        color: '#666'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
    
    speciesChart = new Chart(speciesCtx, {
        type: 'doughnut',
        data: {
            labels: config.species.map(s => s.name),
            datasets: [{
                data: config.species.map(s => s.percent),
                backgroundColor: config.species.map(s => s.color),
                borderWidth: 1,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// Carregamento de dados
async function loadTreeData(dateRange, region, viewType) {
    toggleLoading(true);
    
    // Simulação de API com dados mais realistas
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const regionConfig = config.regions[region];
    const baseCount = getBaseCountForDate(dateRange.end);
    const treeCount = Math.floor(baseCount * (0.8 + Math.random() * 0.4));
    const speciesCount = Math.min(config.species.length, Math.floor(30 + Math.random() * 70));
    
    const trees = [];
    const heatPoints = [];
    const markerPoints = [];
    
    for (let i = 0; i < treeCount; i++) {
        const lat = regionConfig.center[0] + (Math.random() - 0.5) * 30;
        const lng = regionConfig.center[1] + (Math.random() - 0.5) * 60;
        const species = config.species[Math.floor(Math.random() * speciesCount)];
        const age = Math.floor(Math.random() * 5) + 1;
        const health = Math.random() > 0.1 ? 'healthy' : 'damaged';
        
        trees.push({
            lat,
            lng,
            species: species.name,
            scientific: species.scientific,
            age,
            health,
            co2: (config.co2PerTree * (0.8 + Math.random() * 0.4)).toFixed(2)
        });
        
        heatPoints.push([lat, lng, 0.3 + Math.random() * 0.7]);
        markerPoints.push([lat, lng]);
    }
    
    toggleLoading(false);
    return { 
        trees, 
        heatPoints, 
        markerPoints, 
        treeCount, 
        speciesCount,
        co2Reduction: (treeCount * config.co2PerTree) / 1000,
        oxygenProduction: (treeCount * config.oxygenPerTree) / 1000,
        tempReduction: (treeCount * config.coolingPer1000Trees) / 1000
    };
}

function getBaseCountForDate(date) {
    const dateKey = date.substring(0, 7);
    return config.historicalData[dateKey]?.trees || 500000;
}

// Atualização do mapa
function updateMap(data) {
    clearMap();
    
    // Aplica a visualização selecionada
    if (currentView === 'heatmap') {
        heatLayer = L.heatLayer(data.heatPoints, {
            radius: 20,
            blur: 15,
            maxZoom: 17,
            gradient: config.regions[currentRegion].gradient
        }).addTo(map);
    } else if (currentView === 'cluster') {
        markerCluster = L.markerClusterGroup({
            iconCreateFunction: function (cluster) {
                const count = cluster.getChildCount();
                let size = 'small';
                if (count > 100) size = 'large';
                else if (count > 30) size = 'medium';
                
                return L.divIcon({
                    html: `<div class="cluster-marker ${size}">${count}</div>`,
                    className: 'cluster',
                    iconSize: L.point(40, 40)
                });
            }
        });
        
        data.markerPoints.forEach(point => {
            const marker = L.marker([point[0], point[1]], {
                icon: L.divIcon({
                    className: 'tree-marker',
                    html: `<i class="fas fa-tree"></i>`,
                    iconSize: [24, 24]
                })
            });
            markerCluster.addLayer(marker);
        });
        
        map.addLayer(markerCluster);
    } else { // Pontos individuais
        data.trees.forEach(tree => {
            const marker = L.marker([tree.lat, tree.lng], {
                icon: L.divIcon({
                    className: `tree-marker ${tree.health}`,
                    html: `<i class="fas fa-tree"></i>`,
                    iconSize: [20, 20]
                })
            }).addTo(map);
            
            marker.bindPopup(`
                <div class="popup-content">
                    <div class="popup-title">${tree.species}</div>
                    <div class="popup-scientific">${tree.scientific}</div>
                    <div class="popup-grid">
                        <div class="popup-row">
                            <span class="popup-label"><i class="fas fa-calendar"></i> Idade:</span>
                            <span>${tree.age} anos</span>
                        </div>
                        <div class="popup-row">
                            <span class="popup-label"><i class="fas fa-cloud"></i> CO2:</span>
                            <span>${tree.co2} kg/ano</span>
                        </div>
                        <div class="popup-row">
                            <span class="popup-label"><i class="fas fa-heartbeat"></i> Saúde:</span>
                            <span class="health-${tree.health}">${tree.health === 'healthy' ? 'Saudável' : 'Danificada'}</span>
                        </div>
                    </div>
                </div>
            `);
            
            markers.push(marker);
        });
    }
    
    // Atualiza a visualização do mapa
    map.setView(config.regions[currentRegion].center, config.regions[currentRegion].zoom);
    
    // Atualiza a UI
    updateUI(data);
    updateEnvironmentalImpact(data);
    updateSpeciesList();
}

function clearMap() {
    // Remove todas as camadas de visualização
    if (heatLayer) {
        map.removeLayer(heatLayer);
        heatLayer = null;
    }
    
    if (markerCluster) {
        map.removeLayer(markerCluster);
        markerCluster = null;
    }
    
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
}

function updateUI(data) {
    // Atualiza os contadores
    document.getElementById('tree-count').textContent = data.treeCount.toLocaleString();
    document.getElementById('species-count').textContent = data.speciesCount;
    document.getElementById('co2-count').textContent = data.co2Reduction.toFixed(1);
    
    // Atualiza as estatísticas
    document.getElementById('stat-trees').textContent = data.treeCount.toLocaleString();
    document.getElementById('stat-species').textContent = data.speciesCount;
    
    // Atualiza o timestamp
    const now = new Date();
    document.getElementById('update-time').textContent = now.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function updateEnvironmentalImpact(data) {
    // Anima os valores
    animateValue('stat-co2', 0, data.co2Reduction, 2000);
    animateValue('stat-oxigenio', 0, data.oxygenProduction, 2000);
    
    // Atualiza o gráfico de temperatura
    if (tempChart) {
        tempChart.data.datasets[0].data = [0, data.tempReduction/2, data.tempReduction];
        tempChart.update();
    }
    
    // Atualiza o gráfico de CO2 histórico
    if (co2Chart) {
        const lastKey = Object.keys(config.historicalData).pop();
        const newDataPoint = {
            ...config.historicalData[lastKey],
            trees: data.treeCount,
            species: data.speciesCount,
            co2: data.co2Reduction * 1000,
            oxygen: data.oxygenProduction * 1000
        };
        
        const newKey = currentDate.substring(0, 7);
        config.historicalData[newKey] = newDataPoint;
        
        co2Chart.data.labels = Object.keys(config.historicalData);
        co2Chart.data.datasets[0].data = Object.values(config.historicalData).map(d => d.trees / 1000);
        co2Chart.data.datasets[1].data = Object.values(config.historicalData).map(d => d.species);
        co2Chart.update();
    }
}

function updateSpeciesList() {
    const speciesList = document.getElementById('speciesList');
    speciesList.innerHTML = '';
    
    config.species.forEach(species => {
        const item = document.createElement('div');
        item.className = 'species-item';
        item.innerHTML = `
            <div class="species-info">
                <div class="species-name">${species.name}</div>
                <div class="species-scientific">${species.scientific}</div>
            </div>
            <div class="species-percent">${species.percent}%</div>
            <div class="progress-bar">
                <div class="progress" style="width: ${species.percent}%; background: ${species.color}"></div>
            </div>
        `;
        
        speciesList.appendChild(item);
    });
    
    // Atualiza o gráfico de espécies
    if (speciesChart) {
        speciesChart.update();
    }
}

// Funções auxiliares
function toggleLoading(show) {
    const button = document.getElementById('buscarDados');
    const buttonText = document.getElementById('buttonText');
    const buttonLoading = document.getElementById('buttonLoading');
    
    if (show) {
        button.disabled = true;
        buttonText.textContent = "Processando...";
        buttonLoading.style.display = "inline-block";
    } else {
        button.disabled = false;
        buttonText.textContent = "Atualizar Visualização";
        buttonLoading.style.display = "none";
    }
}

function animateValue(id, start, end, duration) {
    if (countUpInstances[id]) {
        countUpInstances[id].update(end);
    } else {
        const element = document.getElementById(id);
        countUpInstances[id] = new CountUp(id, end, {
            startVal: start,
            duration: duration / 1000,
            decimalPlaces: end < 1 ? 5 : 1,
            separator: '.',
            decimal: ',',
            suffix: end < 1 ? '' : ' t'
        });
        countUpInstances[id].start();
    }
}

// Event Listeners
document.getElementById('buscarDados').addEventListener('click', async function() {
    dateRange.start = document.getElementById('dataInicio').value;
    dateRange.end = document.getElementById('dataFim').value;
    currentRegion = document.getElementById('regiao').value;
    currentView = document.getElementById('tipoVisualizacao').value;
    
    if (!dateRange.start || !dateRange.end) {
        alert("Por favor, selecione um intervalo de datas");
        return;
    }
    
    const data = await loadTreeData(dateRange, currentRegion, currentView);
    updateMap(data);
});

document.getElementById('view-all').addEventListener('click', function() {
    // Implementação futura para modal de espécies
    console.log("Visualizar todas as espécies");
});

// Filtro de espécies
document.getElementById('speciesSearch').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const items = document.querySelectorAll('.species-item');
    
    items.forEach(item => {
        const name = item.querySelector('.species-name').textContent.toLowerCase();
        const scientific = item.querySelector('.species-scientific').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || scientific.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
});

// Filtro de tempo
document.querySelectorAll('.time-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Atualiza o intervalo de datas com base no filtro
        const endDate = new Date();
        let startDate = new Date();
        
        switch(this.textContent) {
            case '24h':
                startDate.setDate(endDate.getDate() - 1);
                break;
            case '7d':
                startDate.setDate(endDate.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(endDate.getDate() - 30);
                break;
            case '1a':
                startDate.setFullYear(endDate.getFullYear() - 1);
                break;
        }
        
        document.getElementById('dataInicio').value = startDate.toISOString().split('T')[0];
        document.getElementById('dataFim').value = endDate.toISOString().split('T')[0];
        
        // Dispara o evento de busca
        document.getElementById('buscarDados').click();
    });
});

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configura datas padrão
    document.getElementById('dataInicio').value = dateRange.start;
    document.getElementById('dataFim').value = dateRange.end;
    
    // Inicializa gráficos
    initCharts();
    
    // Carrega dados iniciais
    document.getElementById('buscarDados').click();
    
    // Configura tooltips
    tippy('[data-tippy-content]', {
        theme: 'light-border',
        animation: 'scale',
        arrow: true,
        duration: 200
    });
});
