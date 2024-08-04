const teamsBtn = document.querySelectorAll(".btn-team");
const teamsDiv = document.querySelector(".teams-container");
const teamInfo = document.querySelector(".teams-info");
const confirmBtn = document.querySelector(".confirm");
const chooseBtn = document.querySelector(".choose");

// Definir quantidade de times
teamsBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        const teamNum = parseInt(btn.getAttribute("teams-data"));
        generateTeamFields(teamNum);
        teamInfo.style.display = "block";
    });
});

// Função para gerar campos do formulário
function generateTeamFields(teamNum) {
    teamsDiv.innerHTML = "";
    for (let i = 1; i <= teamNum; i++) {
        const divTime = document.createElement("div");
        divTime.classList.add("team-info");

        divTime.innerHTML = `
            <h3>Time ${i}</h3>
            <label for="name-${i}">Nome do time:</label>
            <input type="text" id="name-${i}" name="name-${i}" required><br>
            <label for="warcry-${i}">Grito de guerra:</label>
            <input type="text" id="warcry-${i}" name="warcry-${i}" required><br>
            <label for="year-${i}">Ano de Fundação:</label>
            <input type="number" id="year-${i}" name="year-${i}" min="1850" max="2024" required><br>
        `;
        teamsDiv.appendChild(divTime);
    }
}

// Função para verificar se todos os campos estão preenchidos
function validarCampos() {
    const inputs = teamsDiv.querySelectorAll("input");
    for (const input of inputs) {
        if (!input.value) {
            return false;
        }
    }
    return true;
}

// Função para o botão "Escolha por mim" 
chooseBtn.addEventListener("click", () => {
    const inputs = teamsDiv.querySelectorAll("input");

    // Cada input  receberá informações escolhidas aleatoriamente de random-teams.js
    inputs.forEach(input => {
        if (input.id.startsWith("name-")) {
            const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
            const randomAdjectives = adjectives[Math.floor(Math.random() * adjectives.length)];
            input.value = `${randomAnimal} ${randomAdjectives}`;

        } else if (input.id.startsWith("warcry-")) {
            const randomWarcry = warcry[Math.floor(Math.random() * warcry.length)];
            input.value = randomWarcry;

        } else if (input.id.startsWith("year-")) {
            // Math.floor(Math.random() * (max - min + 1)) + min
            input.value = Math.floor(Math.random() * (2024 - 1850 + 1)) + 1850;
        }
    });
});

// Função de confirmação
confirmBtn.addEventListener("click", () => {
    if (validarCampos()) {
        
        // Obter os valores dos inputs e armazenar em um array de objetos
        const teams = [];
        const teamsNum = parseInt(teamsBtn[0].getAttribute("teams-data"));
        
        for (let i = 1; i <= teamsNum; i++) {
            teams.push({
                name: document.getElementById(`name-${i}`).value,
                warcry: document.getElementById(`warcry-${i}`).value,
                ano: document.getElementById(`year-${i}`).value,
            });
        }

    } else {
        alert("Por favor, preencha todos os campos!");
    }
});