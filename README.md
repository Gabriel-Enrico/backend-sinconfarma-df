# 💊 Squad 9 --- SincoFarma

### Sistema de Avaliação de Farmácias do Distrito Federal

O projeto foi desenvolvido pelo **Squad 9** com o objetivo de
**automatizar a criação, gestão e análise de formulários de avaliação
das farmácias do DF**, oferecendo um sistema simples, rápido e moderno.

------------------------------------------------------------------------

## 📌 Visão Geral

O sistema contempla:

-   🔐 **Login e autenticação**
-   📝 **Criação e envio de formulários**
-   📤 **Upload de imagens**
-   📊 **Painel administrativo**
-   🌐 **Páginas HTML servidas diretamente**
-   🐳 **Execução completa via Docker**
-   ⚡ **Experiência rápida e intuitiva**

------------------------------------------------------------------------

## 📂 Repositório Oficial

🔗 **GitHub:**\
https://github.com/lucasppl/saas-sinconfarma-df

------------------------------------------------------------------------

## 📘 Guia de Instalação e Execução (Windows)

Siga os passos abaixo para rodar o MVP em um ambiente limpo:

------------------------------------------------------------------------

### 🖥 1. Requisitos

  Ferramenta    Link para Download
  ------------- --------------------------------
  **Docker**    https://www.docker.com/
  
  **Node.js**   https://nodejs.org/pt/download

------------------------------------------------------------------------

### 📥 2. Baixar o Projeto

Você pode baixar manualmente pelo GitHub ou usar o comando:

    git clone https://github.com/lucasppl/saas-sinconfarma-df

> ⚠️ Requer **Git** instalado.

------------------------------------------------------------------------

### ⚙️ 3. Configurar Arquivos

Edite os seguintes arquivos conforme necessário:

-   `.env`
-   `Dockerfile`
-   `docker-compose.yaml`

------------------------------------------------------------------------

### 🗄️ 4. Iniciar o Banco de Dados

Dentro da pasta **backend**, execute:

    iniciarBanco.bat

Depois, na raiz do projeto, execute:

    frontend.bat

------------------------------------------------------------------------

## 🗂️ 5. Estrutura do Projeto

    backend/
     ├── migrations/           # Arquivos de migração do banco
     ├── node_modules/         # Dependências do backend
     ├── src/                  # Código-fonte do servidor
     ├── uploads/              # Uploads de imagens/arquivos
     ├── Dockerfile            # Build Docker do backend
     ├── iniciarBanco.bat      # Script para iniciar/configurar o banco
     ├── package.json          # Dependências e scripts
     ├── package-lock.json     # Lockfile
     ├── .env                  # Variáveis de ambiente
     └── .env-example          # Exemplo de configuração

    html/                      # Páginas HTML do frontend
    img/                       # Imagens do projeto
    js/                        # Scripts JS
    sass/                      # Arquivos SASS/SCSS
    style/                     # CSS compilado

    docker-compose.yaml        # Orquestração Docker
    frontend.bat               # Inicialização do frontend
    package-lock.json          # Lockfile geral
    comandos.txt               # Comandos úteis
    a.txt                      # Arquivo auxiliar
    .gitignore                 # Arquivos ignorados pelo Git

------------------------------------------------------------------------
## 🔨 6. Sugestões de Melhoria

-   Verificação instantânea da foto, para confirmar localização do avaliador.
-   Inserir uma tela com mapa indicando a rota para a Farmácia.
-   Adquirir um servidor para colocar o projeto para funcionar 24/7.
-   Reconhecimento facial no Login.
------------------------------------------------------------------------
## 👥 7. Autores

Projeto desenvolvido pela **Squad 09**:

-   **Gabriel Enrico Oliveira Sousa**
-   **Pablo Henrique Anastácio de Souza**
-   **Guilherme Ryan Rodrigues Calazans**
-   **Gustavo Aguilar Barrionuevo**
-   **Gustavo Almeida de Sousa**
-   **Gustavo Silva**
-   **Bruno de França**
-   **Lucas Alves**
-   ** Felipe Ribeiro**
