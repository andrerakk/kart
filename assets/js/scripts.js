let currentYearData = null;
let currentChampionshipInfo = {
    titulo_campeonato: "",
    titulo_header: "",
    proxima_etapa_nome: "",
    proxima_etapa_tracado: "",
    proxima_etapa_data: ""
};

function updateDynamicInfo(info) {
    const pageTitle = document.getElementById('page-title');
    if (pageTitle && info.titulo_campeonato) {
        pageTitle.textContent = info.titulo_campeonato;
    }

    const headerMainTitle = document.getElementById('header-main-title');
    if (headerMainTitle && info.titulo_header) {
        headerMainTitle.textContent = info.titulo_header;
    }

    // Attempt to update the next stage info directly if it's already rendered
    const proximasEtapasContainer = document.getElementById('proximas-etapas-container');
    const nextStageName = document.getElementById('next-stage-name');
    const nextStageTrack = document.getElementById('next-stage-track');
    const nextStageDate = document.getElementById('next-stage-date');

    const hasData = info.proxima_etapa_nome && info.proxima_etapa_nome.trim() !== '';

    if (proximasEtapasContainer) {
        const isFinished = proximasEtapasContainer.getAttribute('data-is-finished') === 'true';
        if (isFinished || !hasData) {
            proximasEtapasContainer.style.display = 'none';
        } else {
            proximasEtapasContainer.style.display = 'block';
        }
    }

    if (nextStageName) nextStageName.textContent = info.proxima_etapa_nome || '';
    if (nextStageTrack) nextStageTrack.textContent = info.proxima_etapa_tracado || '';
    if (nextStageDate) nextStageDate.textContent = info.proxima_etapa_data || '';
}

function loadChampionshipInfo(url) {
    if (!url) {
        updateDynamicInfo(currentChampionshipInfo);
        return;
    }

    const noCacheUrl = url + (url.includes('?') ? '&' : '?') + '_t=' + new Date().getTime();
    Papa.parse(noCacheUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            const newInfo = { ...currentChampionshipInfo };
            results.data.forEach(row => {
                const key = row['Chave'] ? row['Chave'].trim() : null;
                const value = row['Valor'] ? row['Valor'].trim() : null;
                if (key && value) {
                    newInfo[key] = value;
                }
            });
            currentChampionshipInfo = newInfo;
            updateDynamicInfo(currentChampionshipInfo);
        },
        error: function (err) {
            console.error('Erro ao carregar informações da aba de configurações:', err);
            updateDynamicInfo(currentChampionshipInfo);
        }
    });

}

function toggleLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        if (show) {
            overlay.classList.remove('hidden');
        } else {
            // Pequeno delay para a animação ser visível
            setTimeout(() => {
                overlay.classList.add('hidden');
            }, 1000);
        }
    }
}

// Executa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const yearSelect = document.getElementById('year-select');
    const categorySelect = document.getElementById('category-select');

    if (yearSelect && typeof CHAMPIONSHIP_YEARS !== 'undefined') {
        // Popula o seletor de anos
        CHAMPIONSHIP_YEARS.forEach(yearObj => {
            const option = document.createElement('option');
            option.value = yearObj.year;
            option.textContent = yearObj.name;
            option.style.color = '#333';
            yearSelect.appendChild(option);
        });

        if (typeof M !== 'undefined' && M.FormSelect) {
            M.FormSelect.init(yearSelect);
        }

        yearSelect.addEventListener('change', (e) => {
            const selectedYear = e.target.value;
            currentYearData = CHAMPIONSHIP_YEARS.find(y => y.year === selectedYear);

            if (currentYearData && currentYearData.infoCsvUrl) {
                loadChampionshipInfo(currentYearData.infoCsvUrl);
            } else {
                updateDynamicInfo(currentChampionshipInfo);
            }

            populateCategories(currentYearData.categories);
        });
    }

    // Carrega o primeiro ano e suas categorias por padrão antes de inicializar o sistema
    if (typeof CHAMPIONSHIP_YEARS !== 'undefined' && CHAMPIONSHIP_YEARS.length > 0) {
        currentYearData = CHAMPIONSHIP_YEARS[0];
    }

    // Inicializa o sistema padrão
    initializeChampionship();
    initializeCompleteSystem(championship);

    // Usa os dados do ano carregado para popular categorias
    if (currentYearData) {
        if (currentYearData.infoCsvUrl) {
            loadChampionshipInfo(currentYearData.infoCsvUrl);
        } else {
            updateDynamicInfo(currentChampionshipInfo);
        }
        populateCategories(currentYearData.categories);
    }
});

function populateCategories(categories) {
    const categorySelect = document.getElementById('category-select');
    if (!categorySelect) return;

    // Limpa opções existentes
    categorySelect.innerHTML = '';

    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        option.style.color = '#333';
        categorySelect.appendChild(option);
    });

    if (typeof M !== 'undefined' && M.FormSelect) {
        // Destruir instância anterior se existir para re-inicializar
        const instance = M.FormSelect.getInstance(categorySelect);
        if (instance) {
            instance.destroy();
        }
        M.FormSelect.init(categorySelect);
    }

    // Remove listener antigo para não acumular (usando clone ou garantindo que só é adicionado uma vez)
    // A melhor forma aqui é atribuir o onchange diretamente
    categorySelect.onchange = (e) => {
        loadCategoryData(e.target.value);
    };

    // Carrega a primeira categoria do ano selecionado
    if (categories.length > 0) {
        loadCategoryData(categories[0].id);
    } else {
        // Limpa os dados se não houver categorias
    }
}




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
// displayIndicators();

let championship;

// Função para formatar os dados parciais lidos do CSV na estrutura suportada pela classe KartChampionship
function parseCSVDataToStages(csvData) {
    const stagesMap = new Map();

    csvData.forEach(row => {
        // Normaliza nomes das colunas para lidar com acentos do Google Sheets
        const etapa = row.Etapa;
        const sessao = row.Sessao || row['Sessão'];
        const piloto = row.Piloto;
        const posicao = row.Posicao || row['Posição'];
        const track = row.Track || row['Traçado'];
        const data = row.Data;

        // Pula linhas incompletas
        if (!etapa || !sessao || !piloto) return;

        const stageId = parseInt(etapa);
        const sType = sessao.toUpperCase(); // 'Q' para qualifying, '1', '2' para baterias
        const raceNumber = (sType === 'Q') ? 1 : parseInt(sType);

        if (!stagesMap.has(stageId)) {
            stagesMap.set(stageId, {
                stage: stageId,
                track: track || `Traçado ${stageId}`,
                date: data || `Etapa ${stageId}`,
                racesMap: new Map() // Para organizar races temporariamente
            });
        }

        const stageObj = stagesMap.get(stageId);

        if (!stageObj.racesMap.has(raceNumber)) {
            stageObj.racesMap.set(raceNumber, {
                race: raceNumber,
                qualifying: [],
                results: []
            });
        }
        const raceObj = stageObj.racesMap.get(raceNumber);

        const resultEntry = {
            position: parseInt(posicao) || 0,
            driver: piloto,
            time: row.Tempo
        };

        if (sType === 'Q') {
            raceObj.qualifying.push(resultEntry);
        } else {
            raceObj.results.push(resultEntry);
        }
    });

    // Converte os Maps de volta para arrays ordendados esperados pelo sistema
    const stagesArray = Array.from(stagesMap.values()).map(s => {
        const racesArray = Array.from(s.racesMap.values()).sort((a, b) => a.race - b.race);
        s.races = racesArray;
        delete s.racesMap; // limpa a propriedade temporária

        // Ordena os arrays de qualifying e results por posição
        s.races.forEach(r => {
            r.qualifying.sort((a, b) => a.position - b.position);
            r.results.sort((a, b) => a.position - b.position);
        });

        return s;
    }).sort((a, b) => a.stage - b.stage);

    return stagesArray;
}

// Função para buscar os dados de uma categoria e atualizar o campeonato
function loadCategoryData(categoryId) {
    if (!currentYearData) return;
    const category = currentYearData.categories.find(c => c.id === categoryId);
    if (!category) return;

    // Mostra feedback de carregamento
    toggleLoading(true);
    const headerTitleElement = document.querySelector('.header-title p');
    if (headerTitleElement) {
        headerTitleElement.innerHTML = `Carregando dados para: ${category.name}...`;
    }

    const noCacheUrl = category.csvUrl + (category.csvUrl.includes('?') ? '&' : '?') + '_t=' + new Date().getTime();
    Papa.parse(noCacheUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            console.log('Dados recebidos via PapaParse:', results.data);

            // Re-inicializa o objeto do campeonato para apagar dados anteriores
            const stages = currentYearData && currentYearData.totalStages ? currentYearData.totalStages : 5;
            const specialStages = currentYearData && currentYearData.specialStages ? currentYearData.specialStages : undefined;
            const configOptions = { totalStages: stages };
            if (specialStages) configOptions.specialPhaseStages = specialStages;
            championship = new KartChampionship(configOptions);
            // Adiciona de volta os listeners da lógica original
            initializeStagesProgressSystem(championship);
            initializeTabsSystem(championship);
            initializeStageContentSystem(championship);

            const stagesData = parseCSVDataToStages(results.data);

            // Remove abas que poderiam ser remanescentes de etapas antigas (limpa DOM)
            const rootTabsContainer = document.querySelector('#geral').parentNode;
            const extraTabs = rootTabsContainer.querySelectorAll('.tab-content');
            extraTabs.forEach(tab => {
                if (tab.id !== 'geral' && tab.id !== 'recordes') {
                    tab.remove();
                }
            });
            const oldResultsLists = document.querySelectorAll('.results-grid');
            oldResultsLists.forEach(grid => {
                if (grid.id !== 'classification-list' && !grid.classList.contains('records-grid')) {
                    grid.innerHTML = ''; //Limpa grids de etapas anteriores
                }
            })

            // Injeta as novas etapas e atualiza a interface
            stagesData.forEach(stageData => {
                championship.addStage(stageData);
            });

            // Ativa o toggle de descartes por padrão se o campeonato acabou
            const switchElement = document.querySelector('.switch input[type="checkbox"]');
            if (switchElement) {
                const isChampionshipFinished = championship.stages.length >= (championship.config.totalStages || 5);
                switchElement.checked = isChampionshipFinished;
            }

            // Após carregar, volta para as guias principais
            showTab('geral');

            updateStatsCardsAndClassification(championship);
            updateRecordsTab(championship);

            if (headerTitleElement) {
                headerTitleElement.innerHTML = `Dashboard do Campeonato - ${category.name}`;
            }
            toggleLoading(false);
        },
        error: function (err) {
            console.error('Erro ao baixar o CSV da categoria:', err);
            if (headerTitleElement) {
                headerTitleElement.innerHTML = `Erro ao carregar dados de ${category.name}`;
            }
            toggleLoading(false);
        }
    });

}


// Função de inicialização - CHAME ESTA QUANDO SUA PÁGINA CARREGAR
function initializeChampionship() {
    // Cria o campeonato
    const stages = currentYearData && currentYearData.totalStages ? currentYearData.totalStages : 5;
    const specialStages = currentYearData && currentYearData.specialStages ? currentYearData.specialStages : undefined;
    const configOptions = { totalStages: stages };
    if (specialStages) configOptions.specialPhaseStages = specialStages;
    championship = new KartChampionship(configOptions);

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
    championship.addStage = function (stageData) {

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
    const leaderLabel = document.getElementById('leader-label');

    if (leaderElement) {
        const leader = useDiscard ? indicators.championshipLeader : indicators.championshipLeaderWithoutDiscard;
        leaderElement.textContent = leader ? leader.name : 'Nenhum líder';
    }

    if (leaderLabel) {
        const isChampionshipFinished = championship.stages.length >= (championship.config.totalStages || 5);
        leaderLabel.textContent = isChampionshipFinished ? 'Campeão' : 'Líder';
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

// Adiciona o listener para o switch usando a variável global
function initializeClassificationSwitch() {
    const switchElement = document.querySelector('.switch input[type="checkbox"]');

    if (switchElement) {
        switchElement.addEventListener('change', function () {
            if (typeof championship !== 'undefined' && championship) {
                // Atualiza classificação e líder no stats card
                updateStatsCardsAndClassification(championship);
                updateLeaderBasedOnSwitch(championship);
            }
        });
    }
}

// Função para atualizar só o líder baseado no switch
function updateLeaderBasedOnSwitch(championship) {
    const indicators = championship.getAllIndicators();
    const switchElement = document.querySelector('.switch input[type="checkbox"]');
    const useDiscard = switchElement ? switchElement.checked : false;

    const leaderElement = document.getElementById('leader-name');
    const leaderLabel = document.getElementById('leader-label');

    if (leaderElement) {
        const leader = useDiscard ?
            indicators.championshipLeader :          // COM descarte
            indicators.championshipLeaderWithoutDiscard; // SEM descarte

        leaderElement.textContent = leader ? leader.name : 'Nenhum líder';
    }

    if (leaderLabel) {
        const isChampionshipFinished = championship.stages.length >= (championship.config.totalStages || 5);
        leaderLabel.textContent = isChampionshipFinished ? 'Campeão' : 'Líder';
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

    // Add active class to clicked button if called via click event
    if (typeof event !== 'undefined' && event && event.target && event.target.classList) {
        event.target.classList.add('active');
    } else {
        // Se chamado programaticamente, tenta achar o botão correspondente
        const btn = Array.from(document.querySelectorAll('.tab-button')).find(
            b => b.getAttribute('onclick') === `showTab('${tabName}')`
        );
        if (btn) btn.classList.add('active');
    }

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

    championship.addStage = function (stageData) {
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

    championship.addStage = function (stageData) {
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
    const style = backgroundStyle || `border-top: 4px solid ${color};`;

    return `
        <div class="record-card" style="${style}">
            <div class="record-header">
                <i class="material-icons" style="color: ${color};">${icon}</i>
                <span class="record-title" style="color: ${color};">${title}</span>
            </div>
            <div class="record-value" style="color: ${color};">${value}</div>
            <p class="record-driver" style="color: ${color};">${driver}</p>
            <p class="record-detail" style="color: #94a3b8;">${detail}</p>
        </div>
    `;
}

// Função para gerar os recordes de pista
function generateTrackRecords(trackRecords) {
    let recordsHtml = '';
    const colors = [
        { bg: 'border-top: 4px solid #ef4444;', color: '#ef4444' },
        { bg: 'border-top: 4px solid #3b82f6;', color: '#3b82f6' },
        { bg: 'border-top: 4px solid #eab308;', color: '#eab308' },
        { bg: 'border-top: 4px solid #10b981;', color: '#10b981' }
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
            <div class="result-item" style="border-left: 4px solid #3b82f6; display: flex; flex-direction: column; align-items: flex-start; gap: 16px; padding: 20px;">
                <p style="margin: 0; color: #93c5fd; font-size: 15px;"><strong>Campeonato iniciando</strong> - Aguardando mais etapas para análise</p>
            </div>
        `;
    }

    const leader = standings[0];
    const second = standings[1];
    const leaderNoDiscard = standingsNoDiscard[0];
    const secondNoDiscard = standingsNoDiscard[1];

    const pointsDiff = leader.totalPointsWithDiscard - second.totalPointsWithDiscard;
    const pointsDiffNoDiscard = leaderNoDiscard.totalPoints - secondNoDiscard.totalPoints;

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
            <div class="result-item" style="border-left: 4px solid #3b82f6; display: flex; flex-direction: column; align-items: flex-start; gap: 16px; padding: 20px;">`;

    if (leader.name === leaderNoDiscard.name) {
        if (pointsDiffNoDiscard === 0 && pointsDiff === 0) {
            situationHtml += `<p style="margin: 0; color: #93c5fd; font-size: 15px;"><strong>Campeonato empatado</strong> na liderança entre ${leader.name} e ${second.name}.</p>`;
        } else if (pointsDiffNoDiscard === 0) {
            situationHtml += `<p style="margin: 0; color: #93c5fd; font-size: 15px;">O campeonato está empatado nos pontos brutos, mas aplicando os descartes, <strong>${leader.name} lidera</strong> com ${pointsDiff} pontos de vantagem.</p>`;
        } else {
            situationHtml += `<p style="margin: 0; color: #93c5fd; font-size: 15px;"><strong>${leader.name} lidera</strong> com ${pointsDiffNoDiscard} pontos de vantagem nos pontos brutos`;
            if (pointsDiff === 0) {
                situationHtml += `, mas, considerando os descartes, o campeonato está <strong>empatado</strong> com ${second.name} na liderança.`;
            } else if (pointsDiff !== pointsDiffNoDiscard) {
                situationHtml += `, mas com os descartes essa diferença ${pointsDiffNoDiscard < pointsDiff ? 'aumenta para' : 'cai para'} ${pointsDiff} pontos.`;
            } else {
                situationHtml += `.`;
            }
            situationHtml += '</p>';
        }
    } else {
        situationHtml += `<p style="margin: 0; color: #93c5fd; font-size: 15px;">Disputa acirrada! <strong>${leaderNoDiscard.name}</strong> lidera nos pontos brutos com ${pointsDiffNoDiscard} de vantagem. `;
        if (pointsDiff === 0) {
            situationHtml += `Porém, aplicando os descartes, o campeonato fica <strong>empatado</strong> na liderança com <strong>${leader.name}</strong>!</p>`;
        } else {
            situationHtml += `Porém, aplicando os descartes, <strong>${leader.name}</strong> assume a verdadeira liderança com ${pointsDiff} pontos de vantagem.</p>`;
        }
    }

    if (remainingStages > 0) {
        situationHtml += `
                <p style="margin: 0; color: #93c5fd; font-size: 15px;"><strong>${remainingStages} etapa${remainingStages > 1 ? 's' : ''} restante${remainingStages > 1 ? 's' : ''}</strong> com aproximadamente ${pointsRemaining} pontos ainda em disputa.</p>
        `;

        if (specialStagesRemaining > 0) {
            situationHtml += `
                <p style="margin: 0; color: #93c5fd; font-size: 15px;"><strong>Fases especiais</strong> podem mudar tudo (${specialStagesRemaining} etapa${specialStagesRemaining > 1 ? 's' : ''} com pontuação extra).</p>
            `;
        }
    } else {
        situationHtml += `
                <p style="margin: 0; color: #93c5fd; font-size: 15px;"><strong>Campeonato finalizado!</strong> ${leader.name} é o campeão com ${leader.totalPointsWithDiscard} pontos!</p>
        `;
    }

    situationHtml += `</div>`;
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
        mostVictories?.name || 'Nenhum',
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
        '#10b981',
        'border-top: 4px solid #10b981;'
    );

    // Situação do campeonato
    const championshipSituationHtml = generateChampionshipSituation(championship);

    // Verifica se precisa renderizar Próximas Etapas
    const currentStages = championship.stages.length;
    const remainingStages = championship.config.totalStages - currentStages;
    const isFinished = remainingStages <= 0;

    const nextStageName = currentChampionshipInfo.proxima_etapa_nome;
    const hasNextStageInfo = nextStageName && nextStageName.trim() !== '';
    const proximasEtapasDisplay = (isFinished || !hasNextStageInfo) ? 'none' : 'block';

    const proximasEtapasHtml = `
        <div id="proximas-etapas-container" data-is-finished="${isFinished}" style="display: ${proximasEtapasDisplay};">
            <br>
            <!-- Próximas Etapas -->
            <div class="result-card">
                <div class="result-title">
                    <i class="material-icons" style="color: #8b5cf6;">event</i>
                    Próximas Etapas
                </div>

                <div class="result-item" style="border-left: 4px solid #8b5cf6;">
                    <div>
                        <h4 id="next-stage-name" style="margin: 0; color: #c4b5fd; font-weight: 600; font-size: 1.4rem;">${nextStageName || ''}</h4>
                        <p id="next-stage-track" style="margin: 4px 0 0 0; color: #a78bfa; font-size: 14px;">${currentChampionshipInfo.proxima_etapa_tracado || ''}</p>
                    </div>
                    <span id="next-stage-date" style="color: #a78bfa; font-size: 14px;">${currentChampionshipInfo.proxima_etapa_data || ''}</span>
                </div>
            </div>
        </div>
    `;

    return `
        <h2 style="color: #111827; font-weight: 700; margin-bottom: 16px; font-size: 1.8rem;">Recordes e Destaques</h2>

        <div class="records-grid">
            ${trackRecordsHtml}
            ${victoriousCard}
            ${polesCard}
            ${fastestCard}
        </div>
        
        <!-- Situação do Campeonato -->
        <div class="result-card">
            <div class="result-title">
                <i class="material-icons" style="color: #3b82f6;">insights</i>
                Situação do Campeonato
            </div>
            ${championshipSituationHtml}
        </div>
        ${proximasEtapasHtml}
    `;

}

// Função para atualizar o conteúdo da tab recordes
function updateRecordsTab(championship) {
    const recordsDiv = document.getElementById('recordes');
    if (recordsDiv) {
        recordsDiv.innerHTML = generateRecordsContent(championship);
    }
}

// Função para gerar texto formatado da classificação
function generateClassificationText(championship) {
    const indicators = championship.getAllIndicators();
    const switchElement = document.querySelector('.switch input[type="checkbox"]');
    const useDiscard = switchElement ? switchElement.checked : false;

    const standings = useDiscard ? indicators.finalStandings : indicators.finalStandingsWithoutDiscard;
    const discardText = useDiscard ? ' (com descarte)' : ' (sem descarte)';
    const currentDate = new Date().toLocaleDateString('pt-BR');
    const progress = indicators.stagesProgress;

    let text = `🏁 CLASSIFICAÇÃO GERAL DO CAMPEONATO${discardText}\n`;
    text += `📅 Atualização: ${currentDate} | Progresso: ${progress}\n`;
    text += `${'='.repeat(50)}\n\n`;

    standings.forEach((driver, index) => {
        const position = index + 1;
        const points = useDiscard ? driver.totalPointsWithDiscard : driver.totalPoints;

        text += `${position}º - ${driver.name}\n`;
        text += `   📊 ${points} pontos | 🏆 ${driver.victories} vitórias\n`;
        text += `   🚦 ${driver.poles} poles | ⚡ ${driver.fastestLaps} v.rápidas\n`;
        text += `   🏁 ${driver.racesParticipated} baterias | 📍 ${driver.stagesParticipated.length} etapas\n`;
        text += `\n`;
    });

    text += `${'='.repeat(50)}\n`;
    text += `🏎️ ${currentChampionshipInfo.titulo_campeonato || "Troféu Cataratas de Kart Rental"}\n`;

    return text;
}

// Função para copiar classificação para clipboard
async function copyClassificationToClipboard(championship) {
    try {
        const text = generateClassificationText(championship);
        await navigator.clipboard.writeText(text);

        showExportFeedback('Classificação copiada para a área de transferência!', 'success');
        return true;
    } catch (err) {
        console.error('Erro ao copiar:', err);
        showExportFeedback('Erro ao copiar classificação', 'error');
        return false;
    }
}

// Função para baixar classificação como arquivo de texto
function downloadClassificationAsText(championship) {
    try {
        const text = generateClassificationText(championship);
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `classificacao_campeonato_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showExportFeedback('Arquivo baixado com sucesso!', 'success');
        return true;
    } catch (err) {
        console.error('Erro ao baixar:', err);
        showExportFeedback('Erro ao baixar arquivo', 'error');
        return false;
    }
}

// Função para gerar HTML igual ao layout dos cards da classificação
function generateClassificationHTML(championship) {
    const indicators = championship.getAllIndicators();
    const switchElement = document.querySelector('.switch input[type="checkbox"]');
    const useDiscard = switchElement ? switchElement.checked : false;

    const standings = useDiscard ? indicators.finalStandings : indicators.finalStandingsWithoutDiscard;
    const discardText = useDiscard ? ' (com descarte)' : ' (sem descarte)';
    const currentDate = new Date().toLocaleDateString('pt-BR');
    const progress = indicators.stagesProgress;

    let html = `
        <div style="font-family: 'Montserrat', sans-serif; width: 1080px; min-height: 1920px; margin: 0; padding: 60px 50px; background-color: #121215; background-image: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.03) 50%, rgba(255, 255, 255, 0.03) 75%, transparent 75%, transparent 100%); background-size: 60px 60px; box-sizing: border-box; display: flex; flex-direction: column; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
            
            <div style="text-align: center; margin-bottom: 50px; padding-bottom: 30px; border-bottom: 4px solid #ef4444;">
                <h2 style="color: #f8fafc; margin: 0 0 10px 0; font-size: 3.5rem; font-family: 'Racing Sans One', sans-serif; text-transform: uppercase; text-shadow: 2px 2px 0px rgba(0,0,0,0.8);">Classificação Geral</h2>
                <h3 style="color: #ef4444; margin: 0 0 16px 0; font-size: 2rem; font-family: 'Racing Sans One', sans-serif; text-transform: uppercase;">${currentChampionshipInfo.titulo_header || "Troféu Cataratas de Kart"}</h3>
                <p style="color: #94a3b8; margin: 0; font-size: 1.4rem; font-weight: 700; text-transform: uppercase;">${discardText} • Atualização: ${currentDate} • Progresso: ${progress}</p>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 20px; flex-grow: 1;">
    `;

    standings.forEach((driver, index) => {
        const position = index + 1;
        const points = useDiscard ? driver.totalPointsWithDiscard : driver.totalPoints;

        let cardStyle = '';
        let badgeStyle = '';

        if (position === 1) {
            cardStyle = 'background: linear-gradient(to right, #3f2e04, #1e1e24); border-left: 8px solid #eab308; border-top: 1px solid #333; border-right: 1px solid #333; border-bottom: 1px solid #333;';
            badgeStyle = 'background: #eab308; color: #000;';
        } else if (position === 2) {
            cardStyle = 'background: #1e1e24; border-left: 8px solid #94a3b8; border-top: 1px solid #333; border-right: 1px solid #333; border-bottom: 1px solid #333;';
            badgeStyle = 'background: #94a3b8; color: #000;';
        } else if (position === 3) {
            cardStyle = 'background: #1e1e24; border-left: 8px solid #b45309; border-top: 1px solid #333; border-right: 1px solid #333; border-bottom: 1px solid #333;';
            badgeStyle = 'background: #fff; color: #b45309;';
        } else {
            cardStyle = 'background: #1e1e24; border-left: 8px solid #ef4444; border-top: 1px solid #333; border-right: 1px solid #333; border-bottom: 1px solid #333;';
            badgeStyle = 'background: #334155; color: #f8fafc;';
        }

        html += `
            <div class="driver-card" style="${cardStyle} border-radius: 12px; padding: 24px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 24px;">
                        <div style="width: 70px; height: 70px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 32px; font-family: 'Racing Sans One', sans-serif; transform: skewX(-10deg); box-shadow: 3px 3px 0px rgba(0,0,0,0.5); ${badgeStyle}">
                            <div style="transform: skewX(10deg);">${position}º</div>
                        </div>
                        <div>
                            <h3 style="margin: 0 0 8px 0; color: #f8fafc; font-weight: 800; font-size: 30px; text-transform: uppercase; font-style: italic; letter-spacing: 1px;">${driver.name}</h3>
                            <div style="display: flex; gap: 20px;">
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <span style="color: #94a3b8; font-size: 16px; font-weight: 700; text-transform: uppercase;">VITÓRIAS</span>
                                    <span style="color: #34d399; font-size: 20px; font-family: 'Racing Sans One', sans-serif;">${driver.victories}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <span style="color: #94a3b8; font-size: 16px; font-weight: 700; text-transform: uppercase;">POLES</span>
                                    <span style="color: #a78bfa; font-size: 20px; font-family: 'Racing Sans One', sans-serif;">${driver.poles}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <span style="color: #94a3b8; font-size: 16px; font-weight: 700; text-transform: uppercase;">V. RÁPIDAS</span>
                                    <span style="color: #f87171; font-size: 20px; font-family: 'Racing Sans One', sans-serif;">${driver.fastestLaps}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <h2 style="margin: 0 0 4px 0; color: #eab308; font-weight: 400; font-size: 56px; font-family: 'Racing Sans One', sans-serif; text-shadow: 3px 3px 0px rgba(0,0,0,0.6);">${points}</h2>
                        <p style="margin: 0; color: #94a3b8; font-size: 18px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">pontos</p>
                    </div>
                </div>
            </div>
        `;
    });

    html += `
            </div>
            
            <div style="text-align: center; margin-top: 50px; padding-top: 40px; border-top: 2px solid #333;">
                <p style="color: #f8fafc; font-size: 1.8rem; font-weight: 400; font-family: 'Racing Sans One', sans-serif; text-transform: uppercase; margin: 0 0 10px 0;">${currentChampionshipInfo.titulo_campeonato || "3º Troféu Cataratas de Kart Rental 2025"}</p>
                <p style="color: #64748b; font-size: 1.2rem; font-weight: 600; text-transform: uppercase; margin: 0;">Acelere conosco nas próximas etapas!</p>
            </div>
        </div>
    `;

    return html;
}

// Função para exportar como imagem
async function exportClassificationAsImage(championship) {
    try {
        // Verifica se html2canvas está disponível
        if (typeof html2canvas === 'undefined') {
            showExportFeedback('Erro: Biblioteca html2canvas não encontrada. Adicione no HTML: <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>', 'error');
            return;
        }

        // Cria um elemento temporário com o HTML da classificação
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = generateClassificationHTML(championship);
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '0';
        document.body.appendChild(tempDiv);

        // Aguarda um momento para o DOM ser atualizado
        await new Promise(resolve => setTimeout(resolve, 100));

        // Usa html2canvas para converter em imagem
        const canvas = await html2canvas(tempDiv.firstElementChild, {
            backgroundColor: '#121215',
            scale: 2, // Para melhor qualidade
            useCORS: true,
            allowTaint: true,
            width: 1080,
            height: tempDiv.firstElementChild.offsetHeight
        });

        // Remove elemento temporário
        document.body.removeChild(tempDiv);

        // Converte canvas para blob e baixa
        canvas.toBlob(function (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `classificacao_campeonato_${new Date().toISOString().split('T')[0]}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            showExportFeedback('Imagem baixada com sucesso!', 'success');
        }, 'image/png');

    } catch (err) {
        console.error('Erro ao exportar imagem:', err);
        showExportFeedback('Erro ao gerar imagem', 'error');
    }
}

// Função para gerar HTML em formato Tabela A4 para PDF
function generatePrintClassificationHTML(championship) {
    const indicators = championship.getAllIndicators();
    const switchElement = document.querySelector('.switch input[type="checkbox"]');
    const useDiscard = switchElement ? switchElement.checked : false;

    const standings = useDiscard ? indicators.finalStandings : indicators.finalStandingsWithoutDiscard;
    const discardText = useDiscard ? ' (com descarte)' : ' (sem descarte)';
    const currentDate = new Date().toLocaleDateString('pt-BR');
    const progress = indicators.stagesProgress;

    let html = `
        <div style="font-family: 'Montserrat', sans-serif; max-width: 100%; margin: 0 auto; padding: 20px; background: white; color: #111;">
            
            <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #ef4444; padding-bottom: 15px;">
                <h2 style="margin: 0 0 5px 0; font-size: 28px; font-family: 'Racing Sans One', sans-serif; text-transform: uppercase; color: #111;">Classificação Geral - ${currentChampionshipInfo.titulo_header || "Troféu Cataratas de Kart"}</h2>
                <p style="margin: 0; font-size: 14px; color: #555;">${discardText} • Atualização: ${currentDate} • Progresso: ${progress}</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
                <thead>
                    <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                        <th style="padding: 10px 5px; text-align: center; width: 50px;">Pos</th>
                        <th style="padding: 10px; text-align: left;">Piloto</th>
                        <th style="padding: 10px; text-align: center;">Baterias</th>
                        <th style="padding: 10px; text-align: center;">Vitórias</th>
                        <th style="padding: 10px; text-align: center;">Poles</th>
                        <th style="padding: 10px; text-align: center;">V. Rápidas</th>
                        <th style="padding: 10px; text-align: center;">Etapas</th>
                        <th style="padding: 10px; text-align: center; font-weight: bold; font-size: 16px;">Pontos</th>
                    </tr>
                </thead>
                <tbody>
    `;

    standings.forEach((driver, index) => {
        const position = index + 1;
        const points = useDiscard ? driver.totalPointsWithDiscard : driver.totalPoints;
        const rowBg = index % 2 === 0 ? '#ffffff' : '#f8fafc';

        let posStyle = "font-weight: bold; font-family: 'Racing Sans One', sans-serif; font-size: 16px;";
        if (position === 1) posStyle += ' color: #b45309; background-color: #fef08a; border-radius: 4px; padding: 2px 6px;';
        else if (position === 2) posStyle += ' color: #334155; background-color: #e2e8f0; border-radius: 4px; padding: 2px 6px;';
        else if (position === 3) posStyle += ' color: #78350f; background-color: #fed7aa; border-radius: 4px; padding: 2px 6px;';

        html += `
            <tr style="background-color: ${rowBg}; border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 5px; text-align: center;"><span style="${posStyle}">${position}º</span></td>
                <td style="padding: 8px; font-weight: 600; text-transform: uppercase;">${driver.name}</td>
                <td style="padding: 8px; text-align: center;">${driver.racesParticipated}</td>
                <td style="padding: 8px; text-align: center; color: #dc2626; font-weight: bold;">${driver.victories}</td>
                <td style="padding: 8px; text-align: center; color: #2563eb; font-weight: bold;">${driver.poles}</td>
                <td style="padding: 8px; text-align: center; color: #059669; font-weight: bold;">${driver.fastestLaps}</td>
                <td style="padding: 8px; text-align: center;">${driver.stagesParticipated.length}</td>
                <td style="padding: 8px; text-align: center; font-weight: 800; font-size: 16px; color: #111; font-family: 'Racing Sans One', sans-serif;">${points}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
            
            <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 10px;">
                <p style="margin: 0; font-family: 'Racing Sans One', sans-serif; font-size: 14px;">${currentChampionshipInfo.titulo_campeonato || "3º Troféu Cataratas de Kart Rental 2025"}</p>
                <p style="margin: 4px 0 0 0;">Impressão Oficial</p>
            </div>
        </div>
    `;

    return html;
}

// Função para abrir classificação em nova janela para impressão
function printClassification(championship) {
    const html = generatePrintClassificationHTML(championship);
    const printWindow = window.open('', '_blank');

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Classificação do Campeonato</title>
            <meta charset="utf-8">
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,600;0,700;0,800;1,800&family=Racing+Sans+One&display=swap" rel="stylesheet">
            <style>
                @media print {
                    body { margin: 0; padding: 0; background-color: white; }
                    @page { size: A4 portrait; margin: 1cm; }
                    /* Prevent table rows from separating across pages */
                    tr { page-break-inside: avoid; break-inside: avoid; }
                }
                body { margin: 20px; background-color: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            </style>
        </head>
        <body>
            ${html}
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // Aguarda o carregamento das fontes antes de chamar print()
    setTimeout(() => {
        printWindow.print();
    }, 1000);
}

// Função para mostrar feedback visual
function showExportFeedback(message, type) {
    // Remove feedback anterior se existir
    const existingFeedback = document.querySelector('.export-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }

    const feedback = document.createElement('div');
    feedback.className = 'export-feedback';
    feedback.textContent = message;

    const bgColor = type === 'success' ? '#4caf50' : '#f44336';
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
        max-width: 300px;
        font-size: 14px;
    `;

    // Adiciona CSS da animação se não existir
    if (!document.querySelector('#export-feedback-css')) {
        const style = document.createElement('style');
        style.id = 'export-feedback-css';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(feedback);

    // Remove após 4 segundos
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.remove();
        }
    }, 4000);
}

// Função para criar botões de exportação
function createExportButtons() {
    return `
        <div class="export-buttons" style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
            <button onclick="copyClassificationToClipboard(championship)" 
                    style="background: #1976d2; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px; transition: background 0.2s;">
                <i class="material-icons" style="font-size: 18px;">content_copy</i>
                Copiar
            </button>
            
    
            
            <button onclick="exportClassificationAsImage(championship)" 
                    style="background: #e91e63; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px; transition: background 0.2s;">
                <i class="material-icons" style="font-size: 18px;">image</i>
                Salvar PNG
            </button>
            
            <button onclick="printClassification(championship)" 
                    style="background: #7b1fa2; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px; transition: background 0.2s;">
                <i class="material-icons" style="font-size: 18px;">print</i>
                Imprimir/PDF
            </button>
        </div>
    `;
}

// Função para adicionar botões de exportação à classificação
function addExportButtonsToClassification() {
    const classificationTitle = document.querySelector('#geral h2');
    if (classificationTitle && !document.querySelector('.export-buttons')) {
        classificationTitle.insertAdjacentHTML('afterend', createExportButtons());
    }
}

function initializeCompleteSystem(championship) {
    const originalAddStage = championship.addStage.bind(championship);

    championship.addStage = function (stageData) {
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
    addExportButtonsToClassification();
}