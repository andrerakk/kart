// assets/js/config.js

const CHAMPIONSHIP_YEARS = [
    {
        year: "2026",
        name: "2026",
        totalStages: 4,
        specialStages: [4],
        infoCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRfTPbDop60VWcFTU7TzeY_PowBQ-A8Jp6ULk4RsW3oiCyQSHUyV0oekBO4de6lEsXlXbk3mpahuYJ5/pub?gid=770163721&single=true&output=csv", // COLE AQUI A URL DO CSV DA ABA DE CONFIGURAÇÕES (Chave / Valor)
        categories: [
            {
                id: "pro",
                name: "Rental Pro (8hp)",
                csvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRfTPbDop60VWcFTU7TzeY_PowBQ-A8Jp6ULk4RsW3oiCyQSHUyV0oekBO4de6lEsXlXbk3mpahuYJ5/pub?gid=2092517286&single=true&output=csv"
            },
            {
                id: "super",
                name: "Rental Super (8hp)",
                csvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRfTPbDop60VWcFTU7TzeY_PowBQ-A8Jp6ULk4RsW3oiCyQSHUyV0oekBO4de6lEsXlXbk3mpahuYJ5/pub?gid=1692562207&single=true&output=csv"
            },
            {
                id: "sprint",
                name: "Rental Sprint (13hp)",
                csvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRfTPbDop60VWcFTU7TzeY_PowBQ-A8Jp6ULk4RsW3oiCyQSHUyV0oekBO4de6lEsXlXbk3mpahuYJ5/pub?gid=1147355031&single=true&output=csv"
            },
            {
                id: "rental_trophy_13hp",
                name: "Rental Trophy (13hp)",
                csvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRfTPbDop60VWcFTU7TzeY_PowBQ-A8Jp6ULk4RsW3oiCyQSHUyV0oekBO4de6lEsXlXbk3mpahuYJ5/pub?gid=0&single=true&output=csv"
            }
        ]
    },
    {
        year: "2025",
        name: "2025",
        totalStages: 5,
        specialStages: [4, 5],
        infoCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQdLniPHRryThYQv-SgGyNc58-vgnTWFwtCtOUUeiepS9A0lEFw5M0hASOgbfHvjNR0eTq74eNe3u6U/pub?gid=1178237165&single=true&output=csv", // COLE AQUI A URL DO CSV DA ABA DE CONFIGURAÇÕES (Chave / Valor)
        categories: [
            {
                id: "rental_trophy_13hp",
                name: "Rental Trophy (13hp)",
                // Formato CSV no Sheets (Arquivo -> Compartilhar -> Publicar na web -> Valores separados por vírgula (.csv))
                csvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQdLniPHRryThYQv-SgGyNc58-vgnTWFwtCtOUUeiepS9A0lEFw5M0hASOgbfHvjNR0eTq74eNe3u6U/pub?output=csv"
            }
        ]
    }
];
