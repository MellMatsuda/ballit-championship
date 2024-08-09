// ========  MODALS =========
const divRegister = document.querySelector(".register");
const divChampionship = document.querySelector(".championship");
const divGame = document.querySelector(".game");
const divWinner = document.querySelector(".winner");

// ========  CADASTRO =========
const teamsBtn = document.querySelectorAll(".btn-team");
const teamsDiv = document.querySelector(".teams-container");
const teamInfo = document.querySelector(".teams-info");
const confirmBtn = document.querySelector(".confirm");
const chooseBtn = document.querySelector(".choose");
const divAlert = document.getElementById("alert-message");

const totalWinners = [];
let nextPhase = [];
let teams = [];
let playedTeams = [];
let waitingTeam;
let teamA;
let teamB;
let TeamId = 0;

// Definindo a classe Team para organizar os dados dos times
class Team {
    constructor(teamName, warCry, foundationYear) {
        this.name = teamName;
        this.warcry = warCry;
        this.year = foundationYear;
        this.points = 50;
        this.totalScore = 0;
        this.blots = 0;
        this.plifs = 0;
        this.advrunghs = this.id = 0;
    }

    changeScore(modifier) {
        switch (modifier) {
            case `blots`:
                this.points += 5;
                this.totalScore += 5;
                this.blots++;
                break;
            case `plifs`:
                this.points += 1;
                this.totalScore += 1;
                this.plifs++;
                break;
            case `advrunghs`:
                this.points -= 10;
                this.totalScore -= 10;
                this.advrunghs++;
                break;
        }
    }
}

// Definir quantidade de times
teamsBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        const teamNum = parseInt(btn.getAttribute("teams-data"));
        generateTeamFields(teamNum);
        teamInfo.style.display = "block";

        // Alterar cor do botão quando selecionado
        teamsBtn.forEach((otherBtn) => {
            otherBtn.classList.remove("selected");
        });
        btn.classList.add("selected");
    });
});

// Função para gerar campos do formulário
function generateTeamFields(teamNum) {
    teamsDiv.innerHTML = "";

    for (let i = 1; i <= teamNum; i++) {
        const divTime = document.createElement("div");
        divTime.classList.add("team-info");

        divTime.innerHTML = `
      <h3 class="team-title">Time ${i}</h3>
      <label for="name-${i}">Nome do time:</label>
      <input type="text" id="name-${i}" name="name-${i}" placeholder="Ex.: Unicórnios Mágicos" required><br>
      <label for="warcry-${i}">Grito de guerra:</label>
      <input type="text" id="warcry-${i}" name="warcry-${i}" placeholder="Ex.: Tudo nosso, nada deles!" required><br>
      <label for="year-${i}">Ano de Fundação:</label>
      <input type="number" id="year-${i}" name="year-${i}" min="1850" max="2024" placeholder="Ex.: 1999" required><br>
        `;
        teamsDiv.appendChild(divTime);
    }
}

// Função para o botão "Escolha por mim"
function chooseForMe() {
    const inputs = teamsDiv.querySelectorAll("input");

    // Cada input receberá informações escolhidas aleatoriamente de random-teams.js
    inputs.forEach((input) => {
        if (input.id.startsWith("name-")) {
            const randomAnimal =
                animals[Math.floor(Math.random() * animals.length)];
            const randomAdjectives =
                adjectives[Math.floor(Math.random() * adjectives.length)];
            input.value = `${randomAnimal} ${randomAdjectives}`;
        } else if (input.id.startsWith("warcry-")) {
            const randomWarcry =
                warcry[Math.floor(Math.random() * warcry.length)];
            input.value = randomWarcry;
        } else if (input.id.startsWith("year-")) {
            // intervalo: Math.floor(Math.random() * (max - min + 1)) + min
            input.value = Math.floor(Math.random() * (2024 - 1850 + 1)) + 1850;
        }
    });

    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
    });
}

// Função para verificar se todos os campos estão preenchidos
function validateFields() {
    const inputs = teamsDiv.querySelectorAll("input");
    for (const input of inputs) {
        if (!input.value) {
            return false;
        }
    }
    return true;
}

function shuffleTeams(teamsArr) {
    const shuffledTeams = [...teamsArr];

    for (let i = shuffledTeams.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledTeams[i], shuffledTeams[j]] = [
            shuffledTeams[j],
            shuffledTeams[i],
        ];
    }
    return shuffledTeams;
}

// Função do botão de confirmação
function confirmTeams() {
    if (validateFields()) {
        const selectedBtn = document.querySelector(".btn-team.selected");
        const teamsNum = parseInt(selectedBtn.getAttribute("teams-data"));

        for (let i = 1; i <= teamsNum; i++) {
            const team = new Team(
                document.getElementById(`name-${i}`).value,
                document.getElementById(`warcry-${i}`).value,
                document.getElementById(`year-${i}`).value
            );

            team.id = TeamId;
            TeamId++;
            teams.push(team);
        }

        playedTeams = [...teams];
        console.log(teams);
        teams = shuffleTeams(teams);
        console.log(teams);
        divRegister.classList.add("hidden");
        divChampionship.classList.remove("hidden");
    } else {
        divAlert.textContent = "Por favor, preencha todos os campos!";
    }
}

// ========  CAMPEONATO =========
const continueBtn = document.querySelector(".continue");
const finishBtn = document.querySelector(".finish");
let currentPhase = 1;
let playedGames = 0;
let gamesNum = 0;

// partidas
function championship() {
    let index = 0;

    advrungh();

    if (teams.length % 2 != 0) {
        waitingTeam = { ...teams[teams.length - 1] };
        teams.pop();
        console.log("Time aguargando: ", waitingTeam);
    }

    const roundNum = document.querySelector(".round");

    roundNum.textContent = `${currentPhase}ª fase`;

    if (teams.length > 1) {
        const tableBody = document.querySelector(".table tbody");
        tableBody.innerHTML = "";

        advrungh();

        for (let i = 0; i < teams.length / 2; i++) {
            const team1 = teams[i * 2].name;
            const team2 = teams[i * 2 + 1].name;

            const newRow = tableBody.insertRow();
            const cell1 = newRow.insertCell();
            const cell2 = newRow.insertCell();

            cell1.innerHTML = `${team1} <b>VS</b> ${team2}`;
            cell2.innerHTML = `
              <a class="play-btn main-btn"
              data-game="${i + 1}"
              data-team1="${team1}"
              data-team2="${team2}">▶ Jogar
              </a>
              <span id="winner-${i + 1}"></span>
              `;

            if (teams.length === 2) {
                console.log("tem 2 timnesss");
                break;
            }
        }

        // Visualizar times de cada partida
        ///////////////////////////////////////////////////////////////////////
        const playBtn = document.querySelectorAll(".play-btn");

        // disputa
        for (let i = 0; i < playBtn.length; i++) {
            playBtn[i].addEventListener("click", () => {
                const divGame = document.querySelector(".game");
                // disputa inicializada
                divGame.classList.remove("hidden");
                divChampionship.classList.add("hidden");
                playBtn[i].style.display = "none";

                index = i * 2;
                playedGames++;
                gamesNum++;

                advrungh();

                console.log("playedGames: ", playedGames);
                console.log(playBtn.length);
                console.log(gamesNum);

                if (gamesNum === playBtn.length) {
                    if (teams.length == 2) {
                        finishBtn.classList.remove("hidden");
                    } else {
                        continueBtn.classList.remove("hidden");
                    }
                }

                teamA = new Team(
                    teams[index].name,
                    teams[index].warcry,
                    teams[index].year
                );
                teamA.totalScore = teams[index].totalScore;
                teamA.blots = teams[index].blots;
                teamA.plifs = teams[index].plifs;
                teamA.advrunghs = teams[index].advrunghs;
                teamA.id = teams[index].id;

                teamB = new Team(
                    teams[index + 1].name,
                    teams[index + 1].warcry,
                    teams[index + 1].year
                );
                teamB.totalScore = teams[index + 1].totalScore;
                teamB.blots = teams[index + 1].blots;
                teamB.plifs = teams[index + 1].plifs;
                teamB.advrunghs = teams[index + 1].advrunghs;
                teamB.id = teams[index + 1].id;

                console.log("time A: ", teamA);
                console.log("time B: ", teamB);

                document.querySelector("#team1 .name-team").textContent =
                    teamA.name;
                document.querySelector("#team2 .name-team").textContent =
                    teamB.name;
                function updateScore() {
                    document.getElementById("score-team1").textContent =
                        teamA.points;
                    document.getElementById("score-team2").textContent =
                        teamB.points;
                }
                updateScore();

                // Remover ouvintes de eventos anteriores
                const blotBtns = document.querySelectorAll(".blot-btn");
                const plifBtns = document.querySelectorAll(".plif-btn");

                blotBtns.forEach((btn) => {
                    const newBtn = btn.cloneNode(true);
                    btn.parentNode.replaceChild(newBtn, btn);
                });

                plifBtns.forEach((btn) => {
                    const newBtn = btn.cloneNode(true);
                    btn.parentNode.replaceChild(newBtn, btn);
                });

                // Lidando com clicks nos botoes de Blots e Plifs
                const newBlotBtns = document.querySelectorAll(".blot-btn");
                const newPlifBtns = document.querySelectorAll(".plif-btn");

                for (let i = 0; i < newBlotBtns.length; i++) {
                    newBlotBtns[i].addEventListener("click", () => {
                      const actionsSpan = document.getElementById("actions");
                        switch (i) {
                            case 0:
                                teamA.changeScore(`blots`);
                                actionsSpan.textContent = `\n\nBLOT para ${teamA.name}\n\n`;
                                break;
                            case 1:
                                teamB.changeScore(`blots`);
                                actionsSpan.textContent = `\n\nBLOT para ${teamB.name}\n\n`;
                                break;
                        }
                        advrungh();
                        updateScore();
                    });
                }
                for (let i = 0; i < newPlifBtns.length; i++) {
                    newPlifBtns[i].addEventListener("click", () => {
                      const actionsSpan = document.getElementById("actions");
                        switch (i) {
                            case 0:
                                teamA.changeScore(`plifs`);
                                actionsSpan.textContent = `\n\nPLIF para ${teamA.name}\n\n`;
                                break;
                            case 1:
                                teamB.changeScore(`plifs`);
                                actionsSpan.textContent = `\n\nPLIF para ${teamB.name}\n\n`;
                                break;
                        }
                        advrungh();
                        updateScore();
                    });
                }
            });
        }
    }
    document.querySelector(".end-btn").addEventListener("click", () => {
        let currentWinner;
        advrungh();

        if (teamA.points != teamB.points) {
            currentWinner = teamA.points > teamB.points ? teamA : teamB;
        } else {
            const ri = Math.floor(Math.random() * 2) + 1;
            currentWinner = ri === 1 ? teamA : teamB;

            alert(
                `GRUSHT\n\nA torcida de ${currentWinner.name} gritou mais alto. O decibelímetro quebrou!!!`
            );
        }
        totalWinners.push(currentWinner);
        nextPhase.push(currentWinner);

        function updateTeam(teamObj) {
            for (let i = 0; i < playedTeams.length; i++) {
                if (playedTeams[i].id === teamObj.id) {
                    playedTeams.splice(i, 1);
                    playedTeams.push(teamObj);
                }
            }
        }

        updateTeam(teamA);
        updateTeam(teamB);

        if (currentPhase > 1 && totalWinners.length > 2) {
            if (
                nextPhase[nextPhase.length - 1].name ===
                nextPhase[nextPhase.length - 2].name
            ) {
                nextPhase.pop();
            }
        }

        // Calcula o ID do vencedor de acordo com o índice atual
        const winnerId = `winner-${Math.trunc(index / 2 + 1)}`;
        const totalWinnerspan = document.getElementById(winnerId);

        // Verifica se o elemento existe antes de tentar acessar sua propriedade
        if (totalWinnerspan) {
            console.log("Vencedor: ", totalWinnerspan);
            console.log("Vencedor: ", currentWinner);
            totalWinnerspan.textContent =
                totalWinners[totalWinners.length - 1].name;
        }

        divChampionship.classList.remove("hidden");
        divGame.classList.add("hidden");
    });
}

function nextRound() {
    teams = [...nextPhase];
    teams = shuffleTeams(teams);
    nextPhase = [];

    advrungh();

    continueBtn.classList.add("hidden");

    if (teams.length > 1) {
        gamesNum = 0;
        currentPhase++;
        championship();
    } else {
        endChampionship();
    }
}

function endChampionship() {
    divChampionship.classList.add("hidden");
    divWinner.classList.remove("hidden");

    // confete
    start();
    stop();

    console.log(playedTeams);

    playedTeams = [...playedTeams].sort((b, a) => a.totalScore - b.totalScore);

    console.log(playedTeams);

    const championTeam = totalWinners[totalWinners.length - 1];
    document.querySelector(".winner-name").textContent =
        championTeam.name.toUpperCase();
    document.querySelector(".winner-warcry").textContent =
        championTeam.warcry.toUpperCase();

    const tableFinal = document.querySelector(".finalTable tbody");
    tableFinal.innerHTML = "";

    for (let i = 0; i < playedTeams.length; i++) {
        const team = playedTeams[i];

        const newRow = tableFinal.insertRow();
        const cellName = newRow.insertCell();
        const cellScore = newRow.insertCell();
        const cellBlots = newRow.insertCell();
        const cellPlifs = newRow.insertCell();
        const cellAdvrunghs = newRow.insertCell();

        cellName.innerHTML = team.name;
        cellScore.innerHTML = team.totalScore;
        cellBlots.innerHTML = team.blots;
        cellPlifs.innerHTML = team.plifs;
        cellAdvrunghs.innerHTML = team.advrunghs;
    }
}

function advrungh() {
    const chosenTeam = teams[Math.floor(Math.random() * teams.length)];

    if (Math.floor(Math.random() * (30 - 1)) + 1 === 5) {
        chosenTeam.changeScore("advrunghs");

        alert(
            `ADVRUNGH\n\n${chosenTeam.name} ou sua torcida cometeu uma irregularidade e foram removidos 10 pontos de seu score total.`
        );
    }
}

// ======== CONFETTI =========

function start() {
    setTimeout(function () {
        confetti.start();
    }, 0);
}

function stop() {
    setTimeout(function () {
        confetti.stop();
    }, 4000);
}
