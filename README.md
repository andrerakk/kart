# 🏁 Troféu Cataratas de Kart Rental - Dashboard

Este é o repositório do Dashboard Oficial do **Troféu Cataratas de Kart Rental**. O projeto consiste em uma aplicação web dinâmica e responsiva, focada em apresentar a classificação geral, resultados das etapas, baterias e estatísticas do campeonato de forma clara e moderna.

## ✨ Funcionalidades

*   **Classificação Geral Dinâmica**: Apresenta a tabela de classificação do campeonato calculada dinamicamente, com suporte a descarte de piores resultados.
*   **Resultados por Etapa**: Visualização detalhada das tomadas de tempo e baterias divididas por etapas.
*   **Integração com Google Sheets/CSV**: Utiliza a biblioteca PapaParse para ler os dados das corridas diretamente de planilhas (Google Sheets ou arquivos CSV locais), tornando as atualizações em tempo real e sem complexidade de banco de dados.
*   **Estatísticas Rápidas (Overview)**: Cards informativos exibindo o Líder do Campeonato, Total de Pilotos, Rei das Voltas Rápidas e Piloto com Mais Vitórias.
*   **Seleção de Ano e Categoria**: Suporte multi-ano e categorias dinâmicas gerenciadas via arquivo de configuração.
*   **Design Premium e Responsivo**: Interface implementada usando o framework **Materialize CSS**, com fontes modernas (Montserrat, Racing Sans One) e ícones estilizados.
*   **Suporte a PWA / Impressão PDF**: Estrutura moderna adaptável para múltiplos dispositivos e pronta para impressão de resultados (ex: exportação PDF do grid).

## 📁 Estrutura do Projeto

*   `index.html`: Arquivo principal contendo a estrutura da página, os modais de loading e os tabs de classificação.
*   `assets/css/styles.css`: Arquivo de estilização principal contendo os temas visuais (modo escuro/racing) e animações.
*   `assets/js/config.js`: Arquivo de configuração responsável por mapear as planilhas (URLs) e as regras específicas das etapas e anos.
*   `assets/js/scripts.js`: Lógica principal da aplicação (fetching de dados, renderização dinâmica no DOM, tratamento de abas e eventos).
*   `assets/data/`: Diretório destinado ao armazenamento de arquivos CSV suportados localmente (caso aplicável).

## 🛠️ Tecnologias Utilizadas

*   **HTML5 / CSS3 / JavaScript (Vanilla)**
*   **Materialize CSS** (Framework CSS Front-end)
*   **PapaParse** (Leitura e processamento de dados CSV)
*   **Google Fonts & Material Icons**

