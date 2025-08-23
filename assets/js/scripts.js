document.addEventListener('DOMContentLoaded', function() {
    // Inicializa o sistema
    initializeChampionship();
    initializeCompleteSystem(championship);

    // Exemplo de como adicionar uma etapa completa
    championship.addStage({
        stage: 1,
        track: "Traçado Completo",
        date: "2025-05-24",
        races: [
            {
                race: 1,
                // Tomada de tempo (qualifying)
                qualifying: [
                    { position: 1, driver: "Tiago Avila",      time: "00:49.685" },
                    { position: 2, driver: "André Rak",        time: "00:49.800" },
                    { position: 3, driver: "José Rehrig",      time: "00:49.921" },
                    { position: 4, driver: "Lucas Pereira",    time: "00:50.145" },
                    { position: 5, driver: "Mohamad Jabban",   time: "00:50.145" },
                    { position: 6, driver: "Malio Benitez",    time: "00:50.348" },
                    { position: 7, driver: "Nestor Correa",    time: "00:51.587" }
                ],
                // Bateria 1 – tempos = melhor volta (TMV) da bateria
                results: [
                    { position: 1, driver: "José Rehrig",     time: "00:49.798" },
                    { position: 2, driver: "Lucas Pereira",   time: "00:49.676" },
                    { position: 3, driver: "André Rak",       time: "00:49.684" },
                    { position: 4, driver: "Mohamad Jabban",  time: "00:49.612" }, // melhor volta da bateria
                    { position: 5, driver: "Tiago Avila",     time: "00:49.916" },
                    { position: 6, driver: "Malio Benitez",   time: "00:50.261" },
                    { position: 7, driver: "Nestor Correa",   time: "00:50.750" }
                ]
            },
            {
                race: 2,
                qualifying: [], // não há tomada para a 2ª bateria
                // Bateria 2 – tempos = melhor volta (TMV) da bateria
                results: [
                    { position: 1, driver: "José Rehrig",     time: "00:49.630" },
                    { position: 2, driver: "André Rak",       time: "00:49.481" },
                    { position: 3, driver: "Lucas Pereira",   time: "00:49.387" },
                    { position: 4, driver: "Mohamad Jabban",  time: "00:49.466" },
                    { position: 5, driver: "Tiago Avila",     time: "00:49.367" }, // melhor volta da bateria
                    { position: 6, driver: "Malio Benitez",   time: "00:49.745" },
                    { position: 7, driver: "Nestor Correa",   time: "00:50.373" }
                ]
            }
        ]
    });
    championship.addStage({
        stage: 2,
        track: "Traçado Curto",
        date: "2025-06-28",
        races: [
            {
                race: 1,
                // Tomada de tempo (qualifying)
                qualifying: [
                    { position: 1, driver: "André Rak",       time: "00:44.112" },
                    { position: 2, driver: "Mohamad Jabban",  time: "00:44.135" },
                    { position: 3, driver: "Tiago Avila",     time: "00:44.261" },
                    { position: 4, driver: "José Rehrig",     time: "00:44.764" },
                    { position: 5, driver: "Huan Borges",     time: "00:44.864" },
                    { position: 6, driver: "César Zárate",    time: "00:45.228" }
                ],
                // Bateria 1 – tempos = melhor volta (TMV) da bateria
                results: [
                    { position: 1, driver: "André Rak",       time: "00:44.155" },
                    { position: 2, driver: "Mohamad Jabban",  time: "00:44.289" },
                    { position: 3, driver: "Huan Borges",     time: "00:44.107" }, // melhor volta da bateria
                    { position: 4, driver: "José Rehrig",     time: "00:44.338" },
                    { position: 5, driver: "Tiago Avila",     time: "00:44.331" },
                    { position: 6, driver: "César Zárate",    time: "00:44.470" }
                ]
            },
            {
                race: 2,
                qualifying: [], // não há tomada para a 2ª bateria
                // Bateria 2 – tempos = melhor volta (TMV) da bateria
                results: [
                    { position: 1, driver: "Tiago Avila",     time: "00:43.909" }, // melhor volta da bateria
                    { position: 2, driver: "André Rak",       time: "00:44.151" },
                    { position: 3, driver: "Huan Borges",     time: "00:44.378" },
                    { position: 4, driver: "César Zárate",    time: "00:44.639" },
                    { position: 5, driver: "Mohamad Jabban",  time: "00:44.266" },
                    { position: 6, driver: "José Rehrig",     time: "00:44.493" }
                ]
            }
        ]
    });
    championship.addStage({
        stage: 3,
        track: "Traçado Completo",
        date: "2025-08-09",
        races: [
            {
                race: 1,
                // Tomada de tempo (qualifying)
                qualifying: [
                    { position: 1, driver: "André Rak",          time: "00:48.975" },
                    { position: 2, driver: "Tiago Avila",        time: "00:49.069" },
                    { position: 3, driver: "Jefferson Schlosser",time: "00:49.182" },
                    { position: 4, driver: "Huan Borges",        time: "00:49.208" },
                    { position: 5, driver: "José Rehrig",        time: "00:49.449" },
                    { position: 6, driver: "Sergio Broetto",     time: "00:49.535" },
                    { position: 7, driver: "César Zárate",       time: "00:49.880" }
                ],
                // Bateria 1 – tempos = melhor volta (TMV)
                results: [
                    { position: 1, driver: "André Rak",           time: "00:49.143" },
                    { position: 2, driver: "José Rehrig",         time: "00:48.964" },
                    { position: 3, driver: "Tiago Avila",         time: "00:48.847" }, // melhor volta da bateria
                    { position: 4, driver: "Jefferson Schlosser", time: "00:49.194" },
                    { position: 5, driver: "Sergio Broetto",      time: "00:49.385" },
                    { position: 6, driver: "César Zárate",        time: "00:49.435" },
                    { position: 7, driver: "Huan Borges",         time: "00:48.908" }
                ]
            },
            {
                race: 2,
                qualifying: [], // não há tomada para a 2ª bateria
                // Bateria 2 – tempos = melhor volta (TMV)
                results: [
                    { position: 1, driver: "André Rak",           time: "00:48.824" }, // melhor volta da bateria
                    { position: 2, driver: "José Rehrig",         time: "00:49.097" },
                    { position: 3, driver: "Sergio Broetto",      time: "00:48.881" },
                    { position: 4, driver: "Jefferson Schlosser", time: "00:49.272" },
                    { position: 5, driver: "Tiago Avila",         time: "00:49.372" },
                    { position: 6, driver: "Huan Borges",         time: "00:49.285" },
                    { position: 7, driver: "César Zárate",        time: "00:49.499" }
                ]
            }
        ]
    });

// Obter todos os indicadores dinâmicos
    function displayIndicators() {
        const indicators = championship.getAllIndicators();

        console.log('=== INDICADORES DO CAMPEONATO ===');
        console.log(`Líder (com descarte): ${indicators.championshipLeader?.name} (${indicators.championshipLeader?.totalPointsWithDiscard} pontos)`);
        console.log(`Líder (sem descarte): ${indicators.championshipLeaderWithoutDiscard?.name} (${indicators.championshipLeaderWithoutDiscard?.totalPoints} pontos)`);
        console.log(`Total de pilotos: ${indicators.totalDrivers}`);
        console.log(`Progresso: ${indicators.stagesProgress}`);

        console.log('\n=== RECORDES DE PISTA ===');
        indicators.trackRecords.forEach(record => {
            console.log(`${record.track}: ${record.driver} - ${record.time} (Etapa ${record.stage}, Bateria ${record.race})`);
        });

        console.log(`\n=== LÍDERES ===`);
        console.log(`Mais vitórias: ${indicators.mostVictories?.name} (${indicators.mostVictories?.victories})`);
        console.log(`Mais poles: ${indicators.mostPoles?.name} (${indicators.mostPoles?.poles})`);
        console.log(`Mais voltas rápidas: ${indicators.mostFastestLaps?.name} (${indicators.mostFastestLaps?.fastestLaps})`);

        console.log('\n=== CLASSIFICAÇÃO FINAL (COM DESCARTE) ===');
        indicators.finalStandings.forEach((driver, index) => {
            console.log(`${index + 1}º - ${driver.name}`);
            console.log(`   Baterias: ${driver.racesParticipated} | Etapas: ${driver.stagesParticipated.length}`);
            console.log(`   Vitórias: ${driver.victories} | Poles: ${driver.poles} | V.Rápidas: ${driver.fastestLaps}`);
            console.log(`   Pontos: ${driver.totalPoints} | Com descarte: ${driver.totalPointsWithDiscard}`);
            console.log(`   Baterias perdidas: ${driver.missedRaces} | Descartes efetivos: ${driver.effectiveDiscardCount}`);
            console.log('');
        });

        console.log('\n=== CLASSIFICAÇÃO SEM DESCARTE ===');
        indicators.finalStandingsWithoutDiscard.forEach((driver, index) => {
            console.log(`${index + 1}º - ${driver.name} - ${driver.totalPoints} pontos`);
        });
    }

// Executar exemplo
    displayIndicators();

});
// Variável global para o campeonato (você pode ajustar conforme sua estrutura)
let championship;

// Função de inicialização - CHAME ESTA QUANDO SUA PÁGINA CARREGAR
function initializeChampionship() {
    // Cria o campeonato
    championship = new KartChampionship({
        totalStages: 5 // Ajuste conforme seu campeonato
    });

    // Inicializa o sistema automático de progresso
    initializeStagesProgressSystem(championship);

}

// Ou com configuração customizada:
/*
const championship = new KartChampionship({
    regularPhasePoints: [15, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    specialPhasePoints: [25, 22, 20, 18, 16, 14, 12, 10, 8, 6, 5, 4, 3, 2],
    discardWorstRaces: 2,
    totalStages: 5
});
*/


// Função auxiliar para atualizar uma etapa específica
function updateStage(stageNumber, stageData) {
    championship.addStage({
        stage: stageNumber,
        ...stageData
    });
    displayIndicators();
}

// Função para obter dados de exportação
function exportChampionshipData() {
    return championship.exportData();
}

// Função para atualizar o progresso das etapas
function updateStagesProgress(championship) {
    const indicators = championship.getAllIndicators();
    const stagesProgress = indicators.stagesProgress; // "3/5"
    const [completed, total] = stagesProgress.split('/').map(Number);
    const progressPercentage = Math.round((completed / total) * 100);

    // Atualiza o HTML
    const progressText = document.querySelector('.header-info p');
    const progressBar = document.querySelector('.header-info .determinate');

    if (progressText) {
        progressText.textContent = stagesProgress;
    }

    if (progressBar) {
        progressBar.style.width = `${progressPercentage}%`;
    }
}

// Função para animar a atualização da barra de progresso
function animateStagesProgress(championship, duration = 500) {
    const indicators = championship.getAllIndicators();
    const stagesProgress = indicators.stagesProgress;
    const [completed, total] = stagesProgress.split('/').map(Number);
    const targetPercentage = Math.round((completed / total) * 100);

    const progressText = document.querySelector('.header-info p');
    const progressBar = document.querySelector('.header-info .determinate');

    if (!progressBar || !progressText) {
        console.warn('Elementos de progresso não encontrados. Verifique se o HTML existe.');
        return;
    }

    // Atualiza o texto imediatamente
    progressText.textContent = stagesProgress;

    // Pega a largura atual da barra
    const currentWidth = parseFloat(progressBar.style.width) || 0;

    // Anima a barra de progresso
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Interpolação linear
        const currentPercentage = currentWidth + (targetPercentage - currentWidth) * progress;
        progressBar.style.width = `${currentPercentage}%`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

// Sistema automático - intercepta o addStage para atualizar automaticamente
function initializeStagesProgressSystem(championship) {
    // Guarda referência do método original
    const originalAddStage = championship.addStage.bind(championship);

    // Substitui o método addStage por uma versão que atualiza o progresso
    championship.addStage = function(stageData) {

        // Chama o método original para adicionar a etapa
        originalAddStage(stageData);

        // Atualiza o progresso com animação
        setTimeout(() => {
            animateStagesProgress(this);
        }, 100); // Pequeno delay para garantir que o DOM foi atualizado

        // Dispara evento customizado para outras partes do sistema
        document.dispatchEvent(new CustomEvent('stageAdded', {
            detail: {
                stage: stageData.stage,
                progress: this.getAllIndicators().stagesProgress,
                indicators: this.getAllIndicators()
            }
        }));
    };

    // Atualização inicial (sem animação)
    updateStagesProgress(championship);
}

function updateStatsCardsAndClassification(championship) {
    const indicators = championship.getAllIndicators();
    const switchElement = document.querySelector('.switch input[type="checkbox"]');
    const useDiscard = switchElement ? switchElement.checked : false;

    // Stats cards - Líder sincronizado com o switch
    const leaderElement = document.getElementById('leader-name');
    if (leaderElement) {
        const leader = useDiscard ? indicators.championshipLeader : indicators.championshipLeaderWithoutDiscard;
        leaderElement.textContent = leader ? leader.name : 'Nenhum líder';
    }

    const driversElement = document.getElementById('total-drivers');
    if (driversElement) {
        driversElement.textContent = indicators.totalDrivers;
    }

    const fastKingElement = document.getElementById('fast-king');
    if (fastKingElement) {
        const fastestLapKing = indicators.mostFastestLaps;
        const fastestLaps = indicators.mostFastestLaps?.fastestLaps;
        fastKingElement.textContent = fastestLapKing ? fastestLapKing.name : 'Nenhum registro';
    }

    const victoriesElement = document.getElementById('most-victories');
    if (victoriesElement) {
        const victoriesKing = indicators.mostVictories;
        const victories = indicators.mostVictories?.victories;
        victoriesElement.textContent = victoriesKing ? victoriesKing.name : 'Nenhuma vitória';
    }

    // ADICIONE ESTA LINHA para atualizar classificação também:
    updateClassification(championship);
}

// Função para gerar um card de classificação
function createClassificationCard(driver, position, useDiscard = false) {
    const points = useDiscard ? driver.totalPointsWithDiscard : driver.totalPoints;
    const isLeader = position === 1 ? 'leader' : '';
    const positionClass = position <= 3 ? `position-${position}` : 'position-other';

    return `
        <div class="classification-card ${isLeader}">
            <div class="classification-header">
                <div class="pilot-info">
                    <div class="position-badge ${positionClass}">${position}º</div>
                    <div>
                        <h3 class="pilot-name">${driver.name}</h3>
                        <p class="pilot-subtitle">${driver.racesParticipated} baterias completas</p>
                    </div>
                </div>
                <div class="points-display">
                    <h2 class="points-number">${points}</h2>
                    <p class="points-label">pontos</p>
                </div>
            </div>
            <div class="mini-stats">
                <div class="mini-stat">
                    <p class="mini-stat-value victories">${driver.victories}</p>
                    <p class="mini-stat-label">Vitórias</p>
                </div>
                <div class="mini-stat">
                    <p class="mini-stat-value poles">${driver.poles}</p>
                    <p class="mini-stat-label">Poles</p>
                </div>
                <div class="mini-stat">
                    <p class="mini-stat-value fastest">${driver.fastestLaps}</p>
                    <p class="mini-stat-label">V. Rápidas</p>
                </div>
                <div class="mini-stat">
                    <p class="mini-stat-value stages">${driver.stagesParticipated.length}</p>
                    <p class="mini-stat-label">Etapas</p>
                </div>
            </div>
        </div>
    `;
}

// Função para atualizar a classificação
function updateClassification(championship) {
    const indicators = championship.getAllIndicators();
    const switchElement = document.querySelector('.switch input[type="checkbox"]');
    const useDiscard = switchElement ? switchElement.checked : false;

    // Escolhe a classificação baseada no switch
    const standings = useDiscard ? indicators.finalStandings : indicators.finalStandingsWithoutDiscard;

    // Gera os cards
    let html = '';
    standings.forEach((driver, index) => {
        html += createClassificationCard(driver, index + 1, useDiscard);
    });

    // Atualiza o HTML
    const classificationList = document.getElementById('classification-list');
    if (classificationList) {
        classificationList.innerHTML = html;
    }
}

// Adiciona o listener para o switch
function initializeClassificationSwitch(championship) {
    const switchElement = document.querySelector('.switch input[type="checkbox"]');

    if (switchElement) {
        switchElement.addEventListener('change', function() {
            // Atualiza tanto a classificação quanto o líder no stats card
            updateStatsCardsAndClassification(championship);
        });
    }

    // Atualização inicial
    updateStatsCardsAndClassification(championship);
}

// Adiciona o listener para o switch
function initializeClassificationSwitch(championship) {
    const switchElement = document.querySelector('.switch input[type="checkbox"]');

    if (switchElement) {
        switchElement.addEventListener('change', function() {
            updateClassification(championship);
            updateLeaderBasedOnSwitch(championship);
        });
    }

    // Atualização inicial
    updateClassification(championship);
    updateLeaderBasedOnSwitch(championship);
}

// Função para atualizar só o líder baseado no switch
function updateLeaderBasedOnSwitch(championship) {
    const indicators = championship.getAllIndicators();
    const switchElement = document.querySelector('.switch input[type="checkbox"]');
    const useDiscard = switchElement ? switchElement.checked : false;

    const leaderElement = document.getElementById('leader-name');
    if (leaderElement) {
        const leader = useDiscard ?
            indicators.championshipLeader :          // COM descarte
            indicators.championshipLeaderWithoutDiscard; // SEM descarte

        leaderElement.textContent = leader ? leader.name : 'Nenhum líder';
    }
}

// Função para gerar as tabs dinamicamente
function generateTabs(championship) {
    const navTabs = document.querySelector('.nav-tabs');
    if (!navTabs) return;

    // Limpa as tabs existentes
    navTabs.innerHTML = '';

    // Tab de Classificação Geral (sempre primeira)
    navTabs.innerHTML += `
        <button class="tab-button active" onclick="showTab('geral')">
            <i class="material-icons tab-icon">emoji_events</i>
            Classificação Geral
        </button>
    `;

    // Gera tabs para cada etapa
    championship.stages.forEach(stage => {
        navTabs.innerHTML += `
            <button class="tab-button" onclick="showTab('etapa${stage.stage}')">
                <i class="material-icons tab-icon">flag</i>
                Etapa ${stage.stage}
            </button>
        `;
    });

    // Tab de Recordes (sempre última)
    navTabs.innerHTML += `
        <button class="tab-button" onclick="showTab('recordes')">
            <i class="material-icons tab-icon">star</i>
            Recordes e Destaques
        </button>
    `;
}

// Função showTab dinâmica (substitui a sua)
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Add active class to clicked button
    event.target.classList.add('active');

    // Render content based on tab
    if (tabName === 'geral') {
        // Sua função de classificação geral (se tiver)
        if (typeof renderClassification === 'function') {
            renderClassification();
        }
    } else if (tabName.startsWith('etapa')) {
        // Para tabs de etapas
        if (typeof renderStageResults === 'function') {
            renderStageResults(tabName);
        }
    } else if (tabName === 'recordes') {
        // Para tab de recordes
        if (typeof renderStatistics === 'function') {
            renderStatistics();
        }
    }
}

// Sistema automático - atualiza tabs quando adiciona etapa
function initializeTabsSystem(championship) {
    // Intercepta o addStage para gerar tabs automaticamente
    const originalAddStage = championship.addStage.bind(championship);

    championship.addStage = function(stageData) {
        originalAddStage(stageData);

        // Regenera as tabs
        generateTabs(this);

    };

    // Geração inicial das tabs
    generateTabs(championship);
}

// Função para criar um item de resultado
function createResultItem(position, driver, time, badges = []) {
    const positionClass = position <= 3 ? `position-${position}` : 'position-other';
    const isWinner = position === 1 ? 'winner' : '';

    let badgesHtml = '';
    badges.forEach(badge => {
        if (badge === 'pole') {
            badgesHtml += '<span class="badge badge-pole">🏆 Pole Position</span>';
        } else if (badge === 'fastest') {
            badgesHtml += '<span class="badge badge-fastest">⚡Melhor Volta</span>';
        } else if (badge === 'record') {
            badgesHtml += '<span class="badge badge-record"> ⭐ Recorde do Traçado</span>';
        }
    });

    return `
        <div class="result-item ${isWinner}">
            <div class="result-left">
                <div class="position-badge ${positionClass}">${position}</div>
                <div>
                    <span style="font-weight: 500;">${driver}</span>
                    ${badgesHtml}
                </div>
            </div>
            <div class="result-right">
                <div class="result-time">${time}</div>
            </div>
        </div>
    `;
}

// Função para criar um card de resultado (qualifying ou bateria)
function createResultCard(title, icon, results) {
    let resultsHtml = '';
    results.forEach((result, index) => {
        resultsHtml += createResultItem(
            result.position,
            result.driver,
            result.time,
            result.badges || []
        );
    });

    return `
        <div class="result-card">
            <div class="result-title">
                <i class="material-icons" style="color: #eab308;">${icon}</i>
                ${title}
            </div>
            ${resultsHtml}
        </div>
    `;
}

// Função principal para gerar o conteúdo de uma etapa
// ========================================
// ALTERAÇÃO: Na função generateStageContent()
// ========================================

// SUBSTITUA toda a função generateStageContent por esta versão corrigida:

function generateStageContent(championship, stageNumber) {
    const stage = championship.stages.find(s => s.stage === stageNumber);
    if (!stage) return '';

    const indicators = championship.getAllIndicators();
    const trackRecords = indicators.trackRecords;
    const currentTrackRecord = trackRecords.find(record => record.track === stage.track);

    let cardsHtml = '';

    stage.races.forEach((race, raceIndex) => {
        const raceNumber = raceIndex + 1;

        // TOMADA DE TEMPO (só para a 1ª bateria)
        if (raceNumber === 1 && race.qualifying.length > 0) {
            const qualifyingResults = race.qualifying.map(q => {
                const badges = [];
                // Pole position para o primeiro colocado no qualifying
                if (q.position === 1) {
                    badges.push('pole');
                }

                // LÓGICA CORRIGIDA para recorde no qualifying:
                if (currentTrackRecord &&
                    currentTrackRecord.driver === q.driver &&
                    currentTrackRecord.time === q.time) { // Compara o tempo também
                    badges.push('record');
                }

                return {
                    position: q.position,
                    driver: q.driver,
                    time: q.time,
                    badges: badges
                };
            });

            cardsHtml += createResultCard('Tomada de Tempo', 'emoji_events', qualifyingResults);
        }

        // BATERIA
        const raceResults = race.results.map(r => {
            const badges = [];

            // Melhor volta da bateria
            const fastestInRace = race.results.reduce((fastest, current) =>
                !fastest || championship.compareTime(current.time, fastest.time) < 0 ? current : fastest
            );

            if (r.driver === fastestInRace.driver) {
                badges.push('fastest');

                // LÓGICA CORRIGIDA para recorde do traçado:
                if (currentTrackRecord &&
                    currentTrackRecord.driver === r.driver &&
                    currentTrackRecord.time === r.time) { // Compara o tempo também
                    badges.push('record');
                }
            }

            return {
                position: r.position,
                driver: r.driver,
                time: r.time,
                badges: badges
            };
        });

        const raceTitle = raceNumber === 1 ? '1ª Bateria' : '2ª Bateria';
        cardsHtml += createResultCard(raceTitle, 'flag', raceResults);
    });

    return `
        <h2 style="color: #111827; font-weight: 700; margin-bottom: 16px; font-size: 1.8rem;">
            Etapa ${stageNumber} - ${stage.track}
        </h2>
        <div class="results-grid" id="etapa${stageNumber}-results">
            ${cardsHtml}
        </div>
    `;
}

// Função para criar o conteúdo da tab dinamicamente
function createStageTabContent(championship, stageNumber) {
    // Verifica se a div da etapa já existe
    let stageDiv = document.getElementById(`etapa${stageNumber}`);

    if (!stageDiv) {
        // Cria a div se não existir
        stageDiv = document.createElement('div');
        stageDiv.id = `etapa${stageNumber}`;
        stageDiv.className = 'tab-content';

        // Adiciona ao container das tabs (você pode ajustar o seletor)
        const tabContainer = document.querySelector('#geral').parentNode;
        tabContainer.appendChild(stageDiv);
    }

    // Gera e insere o conteúdo
    stageDiv.innerHTML = generateStageContent(championship, stageNumber);
}

// Sistema automático - cria conteúdo quando adiciona etapa
function initializeStageContentSystem(championship) {
    const originalAddStage = championship.addStage.bind(championship);

    championship.addStage = function(stageData) {
        originalAddStage(stageData);

        // Cria o conteúdo da tab automaticamente
        createStageTabContent(this, stageData.stage);

    };

    // Gera conteúdo para etapas existentes
    championship.stages.forEach(stage => {
        createStageTabContent(championship, stage.stage);
    });
}

// Função para criar um card de recorde
function createRecordCard(title, value, driver, detail, icon, color, backgroundStyle = '') {
    const style = backgroundStyle || `background: linear-gradient(135deg, #fef7ff, #fae8ff); border-color: #e879f9;`;

    return `
        <div class="record-card fastest-lap" style="${style}">
            <div class="record-header">
                <i class="material-icons" style="color: ${color};">${icon}</i>
                <span class="record-title" style="color: ${color};">${title}</span>
            </div>
            <div class="record-value" style="color: ${color};">${value}</div>
            <p class="record-driver" style="color: ${color};">${driver}</p>
            <p class="record-detail" style="color: ${color};">${detail}</p>
        </div>
    `;
}

// Função para gerar os recordes de pista
function generateTrackRecords(trackRecords) {
    let recordsHtml = '';
    const colors = [
        { bg: 'background: linear-gradient(135deg, #fef2f2, #fee2e2); border-color: #fca5a5;', color: '#dc2626' },
        { bg: 'background: linear-gradient(135deg, #f0f9ff, #dbeafe); border-color: #93c5fd;', color: '#1976d2' },
        { bg: 'background: linear-gradient(135deg, #fefce8, #fef3c7); border-color: #fcd34d;', color: '#d97706' },
        { bg: 'background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-color: #86efac;', color: '#059669' }
    ];

    trackRecords.forEach((record, index) => {
        const colorStyle = colors[index % colors.length];
        const sessionText = record.session === 'qualifying' ? 'Classificação' : `${record.race}ª Bateria`;
        const detail = `${sessionText} Etapa ${record.stage}`;

        recordsHtml += createRecordCard(
            `Recorde ${record.track}`,
            record.time,
            record.driver,
            detail,
            'schedule',
            colorStyle.color,
            colorStyle.bg
        );
    });

    return recordsHtml;
}


// Função para gerar situação do campeonato
function generateChampionshipSituation(championship) {
    const indicators = championship.getAllIndicators();
    const standings = indicators.finalStandings;
    const standingsNoDiscard = indicators.finalStandingsWithoutDiscard;

    if (standings.length < 2) {
        return `
            <li><strong>Campeonato iniciando</strong> - Aguardando mais etapas para análise</li>
        `;
    }

    const leader = standings[0];
    const second = standings[1];
    const leaderNoDiscard = standingsNoDiscard[0];

    const pointsDiff = leader.totalPointsWithDiscard - second.totalPointsWithDiscard;
    const pointsDiffNoDiscard = leaderNoDiscard.totalPoints - (standingsNoDiscard[1]?.totalPoints || 0);

    const currentStages = championship.stages.length;
    const remainingStages = championship.config.totalStages - currentStages;
    const specialStagesRemaining = championship.config.specialPhaseStages.filter(stage => stage > currentStages).length;
    let pointsRemaining = 0;
    for (let stage = currentStages + 1; stage <= championship.config.totalStages; stage++) {
        const isSpecial = championship.config.specialPhaseStages.includes(stage);
        if (isSpecial) {
            pointsRemaining += 54;  // Fase especial
        } else {
            pointsRemaining += 34;  // Fase regular
        }
    }

    let situationHtml = `
        <li><strong>${leader.name} lidera</strong> com ${pointsDiffNoDiscard} pontos de vantagem`;

    if (pointsDiff !== pointsDiffNoDiscard) {
        situationHtml += `, mas, considerando os descartes essa diferença ${pointsDiffNoDiscard < pointsDiff ? 'aumenta para' : 'diminui para'} ${pointsDiff} pontos`;
    }
    situationHtml += '</li>';

    if (remainingStages > 0) {
        situationHtml += `
            <li><strong>${remainingStages} etapa${remainingStages > 1 ? 's' : ''} restante${remainingStages > 1 ? 's' : ''}</strong> com aproximadamente ${pointsRemaining} pontos ainda em disputa</li>
        `;

        if (specialStagesRemaining > 0) {
            situationHtml += `
                <li><strong>Fases especiais</strong> podem mudar tudo (${specialStagesRemaining} etapa${specialStagesRemaining > 1 ? 's' : ''} com pontuação extra)</li>
            `;
        }
    } else {
        situationHtml += `
            <li><strong>Campeonato finalizado!</strong> ${leader.name} é o campeão com ${leader.totalPointsWithDiscard} pontos</li>
        `;
    }

    return situationHtml;
}

// Função principal para gerar o conteúdo da tab recordes
function generateRecordsContent(championship) {
    const indicators = championship.getAllIndicators();

    // Recordes de pista
    const trackRecordsHtml = generateTrackRecords(indicators.trackRecords);

    // Stats dos pilotos
    const mostVictories = indicators.mostVictories;
    const mostPoles = indicators.mostPoles;
    const mostFastestLaps = indicators.mostFastestLaps;

    const victoriousCard = createRecordCard(
        'Mais Vitórias',
        mostVictories?.victories || 0,
        mostVictories?.name  || 'Nenhum',
        'Especialista em ganhar',
        'emoji_events',
        '#d97706'
    );

    const polesCard = createRecordCard(
        'Mais Poles',
        mostPoles?.poles || 0,
        mostPoles?.name || 'Nenhum',
        'Especialista em classificação',
        'flash_on',
        '#1976d2'
    );

    const fastestCard = createRecordCard(
        'Mais Voltas Rápidas',
        mostFastestLaps?.fastestLaps || 0,
        mostFastestLaps?.name || 'Nenhum',
        'Especialista em velocidade',
        'flash_on',
        '#059669',
        'background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-color: #86efac;'
    );

    // Situação do campeonato
    const championshipSituationHtml = generateChampionshipSituation(championship);

    return `
        <h2 style="color: #111827; font-weight: 700; margin-bottom: 16px; font-size: 1.8rem;">Recordes e Destaques</h2>

        <div class="records-grid">
            ${trackRecordsHtml}
            ${victoriousCard}
            ${polesCard}
            ${fastestCard}
        </div>
        
        <!-- Situação do Campeonato -->
        <div class="result-card" style="background-color: #eff6ff; border: 1px solid #60a5fa;">
            <div class="result-title">
                <i class="material-icons" style="color: #1976d2;">insights</i>
                Situação do Campeonato
            </div>
            <ul style="color: #1976d2; line-height: 1.6;">
                ${championshipSituationHtml}
            </ul>
        </div>
        <br>
          <!-- Próximas Etapas -->
        <div class="result-card">
            <div class="result-title">
                <i class="material-icons" style="color: #1976d2;">event</i>
                Próximas Etapas
            </div>

            <div class="result-item" style="background-color: #fff3e0; border: 1px solid #ffcc80;">
                <div>
                    <h4 style="margin: 0; color: #fb8c00; font-weight: 600; font-size: 1.4rem;">Etapa 4 - Fase Especial</h4>
                    <p style="margin: 4px 0 0 0; color: #fb8c00; font-size: 14px;">AdrenaKart - Traçado a definir</p>
                </div>
                <span style="color: #fb8c00; font-size: 14px;">13/09/2025</span>
            </div>

            <div class="result-item" style="background-color: #ede7f6; border: 1px solid #b39ddb;">
                <div>
                    <h4 style="margin: 0; color: #673ab7 ; font-weight: 600; font-size: 1.4rem;">Etapa 5 - Fase Especial (FINAL)</h4>
                    <p style="margin: 4px 0 0 0; color: #673ab7 ; font-size: 14px;">AdrenaKart - Traçado a definir</p>
                </div>
                <span style="color: #673ab7 ; font-size: 14px;">04/10/2025</span>
            </div>
        </div>
    `;

}

// Função para atualizar o conteúdo da tab recordes
function updateRecordsTab(championship) {
    const recordsDiv = document.getElementById('recordes');
    if (recordsDiv) {
        recordsDiv.innerHTML = generateRecordsContent(championship);
    }
}


function initializeCompleteSystem(championship) {
    const originalAddStage = championship.addStage.bind(championship);

    championship.addStage = function(stageData) {
        originalAddStage(stageData);
        // Atualiza stats cards e classificação
        updateStatsCardsAndClassification(this);
        // Regenera tabs
        generateTabs(this);
        // Cria conteúdo da etapa
        createStageTabContent(this, stageData.stage);
        // Atualiza tab de recordes
        updateRecordsTab(this);
    };

    // Inicialização
    initializeClassificationSwitch(championship);
    initializeStageContentSystem(championship);
    initializeTabsSystem(championship);
    updateStatsCardsAndClassification(championship);
    updateRecordsTab(championship);
}