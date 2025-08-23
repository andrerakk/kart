// Sistema Dinâmico de Campeonato de Kart
class KartChampionship {
    constructor(config = {}) {
        // Configuração do sistema de pontuação
        this.config = {
            // Pontuação por posição nas fases
            regularPhasePoints: config.regularPhasePoints || [15, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
            specialPhasePoints: config.specialPhasePoints || [25, 22, 20, 18, 16, 14, 12, 10, 8, 6, 5, 4, 3, 2],

            // Pontos extras
            polePoint: config.polePoint || 1,
            fastestLapRace1Point: config.fastestLapRace1Point || 1,
            fastestLapRace2Point: config.fastestLapRace2Point || 1,
            participationPoint: config.participationPoint || 1,

            // Configuração das fases
            regularPhaseStages: config.regularPhaseStages || [1, 2, 3], // Etapas da fase regular
            specialPhaseStages: config.specialPhaseStages || [4, 5], // Etapas da fase especial

            // Número de descartes
            discardWorstRaces: config.discardWorstRaces || 2,

            // Total de etapas do campeonato
            totalStages: config.totalStages || 5
        };

        this.stages = [];
        this.drivers = new Map();
        this.trackRecords = new Map();
    }

    // Adicionar ou atualizar uma etapa
    addStage(stageData) {
        const stage = {
            stage: stageData.stage,
            track: stageData.track,
            date: stageData.date,
            races: stageData.races.map(race => ({
                race: race.race,
                qualifying: race.qualifying.map(q => ({
                    position: q.position,
                    driver: q.driver,
                    time: q.time
                })),
                results: race.results.map(r => ({
                    position: r.position,
                    driver: r.driver,
                    time: r.time,
                    fastestLap: r.fastestLap || null
                }))
            }))
        };

        // Remove etapa existente se houver
        this.stages = this.stages.filter(s => s.stage !== stage.stage);
        this.stages.push(stage);
        this.stages.sort((a, b) => a.stage - b.stage);

        // Recalcula todos os dados
        this.calculateAll();
    }

    // Calcula automaticamente poles, voltas rápidas e recordes
    calculateAll() {
        this.drivers.clear();
        this.trackRecords.clear();

        // Processa cada etapa
        this.stages.forEach(stage => {
            this.processStage(stage);
        });

        // Calcula classificação final
        this.calculateFinalStandings();
    }

    processStage(stage) {
        const stageNumber = stage.stage;
        const track = stage.track;
        let stagePole = null;
        let stageFastestLap1 = null;
        let stageFastestLap2 = null;

        stage.races.forEach((race, raceIndex) => {
            const raceNumber = raceIndex + 1;

            // Determina pole da etapa (melhor tempo do qualifying da 1ª bateria)
            if (raceNumber === 1) {
                const bestQualifying = race.qualifying.reduce((best, current) =>
                    !best || this.compareTime(current.time, best.time) < 0 ? current : best
                );
                stagePole = bestQualifying.driver;
            }

            // Processa resultados da bateria
            race.results.forEach(result => {
                this.initializeDriver(result.driver);

                const driver = this.drivers.get(result.driver);

                // Adiciona pontos da posição
                const points = this.getPositionPoints(stageNumber, result.position);
                driver.racePoints.push({
                    stage: stageNumber,
                    race: raceNumber,
                    position: result.position,
                    points: points
                });

                // Conta vitórias
                if (result.position === 1) {
                    driver.victories++;
                }

                // Conta baterias disputadas
                driver.racesParticipated++;

                // Adiciona etapa participada
                if (!driver.stagesParticipated.includes(stageNumber)) {
                    driver.stagesParticipated.push(stageNumber);
                }
            });

            if (race.qualifying.length > 0) {
                const fastestInQualifying = race.qualifying.reduce((fastest, current) =>
                    !fastest || this.compareTime(current.time, fastest.time) < 0 ? current : fastest
                );

                // Atualiza recorde da pista se for mais rápido
                const currentRecord = this.trackRecords.get(track);
                if (!currentRecord || this.compareTime(fastestInQualifying.time, currentRecord.time) < 0) {
                    this.trackRecords.set(track, {
                        driver: fastestInQualifying.driver,
                        time: fastestInQualifying.time,
                        stage: stageNumber,
                        race: raceNumber,
                        session: 'qualifying' // Identifica que foi no qualifying
                    });
                }
            }

            // Determina volta mais rápida da bateria
            const fastestInRace = race.results.reduce((fastest, current) =>
                !fastest || this.compareTime(current.time, fastest.time) < 0 ? current : fastest
            );

            if (raceNumber === 1) {
                stageFastestLap1 = fastestInRace.driver;
            } else if (raceNumber === 2) {
                stageFastestLap2 = fastestInRace.driver;
            }

            // Atualiza recorde da pista
            const currentRecord = this.trackRecords.get(track);
            if (!currentRecord || this.compareTime(fastestInRace.time, currentRecord.time) < 0) {
                this.trackRecords.set(track, {
                    driver: fastestInRace.driver,
                    time: fastestInRace.time,
                    stage: stageNumber,
                    race: raceNumber,
                    session: 'race' // Identifica que foi numa bateria
                });
            }

            // Conta voltas rápidas para o piloto
            this.initializeDriver(fastestInRace.driver);
            this.drivers.get(fastestInRace.driver).fastestLaps++;
        });

        // Atribui pontos extras da etapa
        if (stagePole) {
            this.initializeDriver(stagePole);
            this.drivers.get(stagePole).poles++;
            this.drivers.get(stagePole).extraPoints += this.config.polePoint;
        }

        if (stageFastestLap1) {
            this.initializeDriver(stageFastestLap1);
            this.drivers.get(stageFastestLap1).extraPoints += this.config.fastestLapRace1Point;
        }

        if (stageFastestLap2) {
            this.initializeDriver(stageFastestLap2);
            this.drivers.get(stageFastestLap2).extraPoints += this.config.fastestLapRace2Point;
        }

        // Ponto de participação para quem completou pelo menos uma bateria
        const stageParticipants = new Set();
        stage.races.forEach(race => {
            race.results.forEach(result => {
                stageParticipants.add(result.driver);
            });
        });

        stageParticipants.forEach(driver => {
            this.initializeDriver(driver);
            this.drivers.get(driver).extraPoints += this.config.participationPoint;
        });
    }

    initializeDriver(driverName) {
        if (!this.drivers.has(driverName)) {
            this.drivers.set(driverName, {
                name: driverName,
                racePoints: [],
                extraPoints: 0,
                victories: 0,
                poles: 0,
                fastestLaps: 0,
                racesParticipated: 0,
                stagesParticipated: [],
                totalPoints: 0,
                totalPointsWithDiscard: 0,
                positionHistory: [] // Para critério de desempate
            });
        }
    }

    getPositionPoints(stage, position) {
        const isSpecialPhase = this.config.specialPhaseStages.includes(stage);
        const pointsTable = isSpecialPhase ? this.config.specialPhasePoints : this.config.regularPhasePoints;
        return pointsTable[position - 1] || 0;
    }

    calculateFinalStandings() {
        // Calcula o total de baterias do campeonato até agora
        const totalRacesInChampionship = this.stages.reduce((total, stage) => total + stage.races.length, 0);

        this.drivers.forEach(driver => {
            // Calcula pontos totais
            const racePoints = driver.racePoints.reduce((sum, race) => sum + race.points, 0);
            driver.totalPoints = racePoints + driver.extraPoints;

            // Calcula baterias perdidas (não participadas)
            const racesParticipated = driver.racePoints.length;
            const missedRaces = totalRacesInChampionship - racesParticipated;

            // Calcula descarte real
            let effectiveDiscardCount = 0;
            if (missedRaces >= this.config.discardWorstRaces) {
                // Se perdeu mais baterias do que o descarte permitido, não há descarte adicional
                effectiveDiscardCount = 0;
            } else {
                // Descarte restante = descarte total - baterias perdidas
                effectiveDiscardCount = this.config.discardWorstRaces - missedRaces;
            }

            // Aplica descarte nas baterias participadas
            const sortedRacePoints = driver.racePoints
                .map(race => race.points)
                .sort((a, b) => a - b); // Ordena do menor para o maior

            const actualDiscardCount = Math.min(effectiveDiscardCount, sortedRacePoints.length);
            const pointsAfterDiscard = sortedRacePoints.slice(actualDiscardCount).reduce((sum, points) => sum + points, 0);
            driver.totalPointsWithDiscard = pointsAfterDiscard + driver.extraPoints;

            // Armazena informações de descarte para relatório
            driver.missedRaces = missedRaces;
            driver.effectiveDiscardCount = actualDiscardCount;

            // Cria histórico de posições para desempate
            driver.positionHistory = driver.racePoints.map(race => race.position).sort((a, b) => a - b);
        });
    }

    // Utilitários
    compareTime(time1, time2) {
        // Converte tempo no formato "mm:ss.mmm" para milissegundos para comparação
        const parseTime = (timeStr) => {
            const parts = timeStr.split(':');
            const minutes = parseInt(parts[0]) * 60000;
            const secondsParts = parts[1].split('.');
            const seconds = parseInt(secondsParts[0]) * 1000;
            const milliseconds = parseInt(secondsParts[1] || 0);
            return minutes + seconds + milliseconds;
        };

        return parseTime(time1) - parseTime(time2);
    }

    // Métodos para obter indicadores dinâmicos
    getChampionshipLeader() {
        if (this.drivers.size === 0) return null;

        const sortedDrivers = this.getFinalStandings();
        return sortedDrivers[0];
    }

    getChampionshipLeaderWithoutDiscard() {
        if (this.drivers.size === 0) return null;

        const driversArray = Array.from(this.drivers.values());

        const sortedDrivers = driversArray.sort((a, b) => {
            // Primeiro critério: pontos totais (sem descarte)
            if (a.totalPoints !== b.totalPoints) {
                return b.totalPoints - a.totalPoints;
            }

            // Segundo critério: mais vitórias
            if (a.victories !== b.victories) {
                return b.victories - a.victories;
            }

            // Terceiro critério: melhor colocação
            for (let pos = 1; pos <= 14; pos++) {
                const aCount = a.positionHistory.filter(p => p === pos).length;
                const bCount = b.positionHistory.filter(p => p === pos).length;
                if (aCount !== bCount) {
                    return bCount - aCount;
                }
            }

            // Quarto critério: mais voltas rápidas
            if (a.fastestLaps !== b.fastestLaps) {
                return b.fastestLaps - a.fastestLaps;
            }

            // Quinto critério: mais poles
            if (a.poles !== b.poles) {
                return b.poles - a.poles;
            }

            return 0;
        });

        return sortedDrivers[0];
    }

    getTotalDrivers() {
        return this.drivers.size;
    }

    getTrackRecords() {
        return Array.from(this.trackRecords.entries()).map(([track, record]) => ({
            track,
            driver: record.driver,
            time: record.time,
            stage: record.stage,
            race: record.race
        }));
    }

    getStagesProgress() {
        const completedStages = Math.max(...this.stages.map(s => s.stage), 0);
        return `${completedStages}/${this.config.totalStages}`;
    }

    getMostVictories() {
        if (this.drivers.size === 0) return null;

        return Array.from(this.drivers.values())
            .reduce((leader, current) =>
                current.victories > leader.victories ? current : leader
            );
    }

    getMostPoles() {
        if (this.drivers.size === 0) return null;

        return Array.from(this.drivers.values())
            .reduce((leader, current) =>
                current.poles > leader.poles ? current : leader
            );
    }

    getMostFastestLaps() {
        if (this.drivers.size === 0) return null;

        return Array.from(this.drivers.values())
            .reduce((leader, current) =>
                current.fastestLaps > leader.fastestLaps ? current : leader
            );
    }

    getFinalStandings() {
        const driversArray = Array.from(this.drivers.values());

        return driversArray.sort((a, b) => {
            // Primeiro critério: pontos com descarte
            if (a.totalPointsWithDiscard !== b.totalPointsWithDiscard) {
                return b.totalPointsWithDiscard - a.totalPointsWithDiscard;
            }

            // Segundo critério: mais vitórias
            if (a.victories !== b.victories) {
                return b.victories - a.victories;
            }

            // Terceiro critério: melhor colocação (menor número de primeiros, segundos, etc.)
            for (let pos = 1; pos <= 14; pos++) {
                const aCount = a.positionHistory.filter(p => p === pos).length;
                const bCount = b.positionHistory.filter(p => p === pos).length;
                if (aCount !== bCount) {
                    return bCount - aCount; // Mais colocações nesta posição é melhor
                }
            }

            // Quarto critério: mais voltas rápidas
            if (a.fastestLaps !== b.fastestLaps) {
                return b.fastestLaps - a.fastestLaps;
            }

            // Quinto critério: mais poles
            if (a.poles !== b.poles) {
                return b.poles - a.poles;
            }

            return 0; // Empate total
        });
    }

    getFinalStandingsWithoutDiscard() {
        const driversArray = Array.from(this.drivers.values());

        return driversArray.sort((a, b) => {
            // Primeiro critério: pontos totais (sem descarte)
            if (a.totalPoints !== b.totalPoints) {
                return b.totalPoints - a.totalPoints;
            }

            // Segundo critério: mais vitórias
            if (a.victories !== b.victories) {
                return b.victories - a.victories;
            }

            // Terceiro critério: melhor colocação
            for (let pos = 1; pos <= 14; pos++) {
                const aCount = a.positionHistory.filter(p => p === pos).length;
                const bCount = b.positionHistory.filter(p => p === pos).length;
                if (aCount !== bCount) {
                    return bCount - aCount;
                }
            }

            // Quarto critério: mais voltas rápidas
            if (a.fastestLaps !== b.fastestLaps) {
                return b.fastestLaps - a.fastestLaps;
            }

            // Quinto critério: mais poles
            if (a.poles !== b.poles) {
                return b.poles - a.poles;
            }

            return 0;
        });
    }

    // Método para obter todos os indicadores de uma vez
    getAllIndicators() {
        return {
            championshipLeader: this.getChampionshipLeader(),
            championshipLeaderWithoutDiscard: this.getChampionshipLeaderWithoutDiscard(),
            totalDrivers: this.getTotalDrivers(),
            trackRecords: this.getTrackRecords(),
            stagesProgress: this.getStagesProgress(),
            mostVictories: this.getMostVictories(),
            mostPoles: this.getMostPoles(),
            mostFastestLaps: this.getMostFastestLaps(),
            finalStandings: this.getFinalStandings(),
            finalStandingsWithoutDiscard: this.getFinalStandingsWithoutDiscard()
        };
    }

    // Método para exportar dados completos
    exportData() {
        return {
            config: this.config,
            stages: this.stages,
            drivers: Object.fromEntries(this.drivers),
            trackRecords: Object.fromEntries(this.trackRecords),
            indicators: this.getAllIndicators()
        };
    }
}