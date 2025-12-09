// TELA INICIAL
btnIniciar.onclick = () => {
    telaInicial.style.display = "none";
    app.style.display = "block";
};

// PONTOS
let pontos = Number(localStorage.getItem("pontos")) || 0;

function showSection(id) {
    document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

// DESAFIOS
let desafios = [
    "Separe o lixo reciclável hoje.",
    "Economize água no banho.",
    "Apague as luzes que não estiver usando.",
    "Desligue aparelhos da tomada.",
    "Reutilize uma garrafa ou pote.",
    "Evite sacolas plásticas.",
    "Caminhe em vez de usar transporte."
];

function gerarDesafios() {
    listaDesafios.innerHTML = "";
    desafios.slice(0, 3).forEach((d, i) => {
        listaDesafios.innerHTML += `
            <div class="card">
                <p>${d}</p>
                <button onclick="concluirDesafio(${i})">Concluir</button>
            </div>`;
    });
}
gerarDesafios();

function concluirDesafio() {
    pontos += 10;
    salvar();
    alert("Você ganhou 10 pontos!");
}

// QUIZ
let perguntas = [
    { 
        q: "Qual é o bioma com maior biodiversidade?", 
        a: "Amazônia", 
        o: ["Amazônia", "Deserto", "Tundra"]
    },
    { 
        q: "Qual ação economiza água?", 
        a: "Fechar a torneira ao escovar", 
        o: ["Lavar calçada", "Fechar a torneira ao escovar", "Deixar vazando"]
    },
];

function iniciarQuiz() {
    let r = perguntas[Math.floor(Math.random() * perguntas.length)];
    quizBox.innerHTML = `
        <div class="card">
            <p><strong>${r.q}</strong></p>
            ${r.o.map(op => `<button onclick="responder('${op}', '${r.a}')">${op}</button>`).join('<br>')}
        </div>`;
}
iniciarQuiz();

function responder(op, cor) {
    if (op === cor) {
        alert("✔ Acertou! +10 pontos");
        pontos += 10;
    } else {
        alert("✖ Errado!");
    }
    salvar();
    iniciarQuiz();
}

// DICAS
let dicas = [
    "Use lâmpadas de LED.",
    "Reduza o tempo no banho.",
    "Evite plástico descartável.",
    "Plante uma muda."
];

function novaDica() {
    dicaTexto.textContent = dicas[Math.floor(Math.random() * dicas.length)];
}
novaDica();

// RANKING
let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

function atualizarRanking() {
    listaRanking.innerHTML = ranking
        .sort((a, b) => b.pontos - a.pontos)
        .map(i => `<p><strong>${i.nome}</strong> — ${i.pontos} pontos</p>`)
        .join('');
}
atualizarRanking();

function salvarScore() {
    let n = nomeJogador.value.trim();
    if (!n) return alert("Digite um nome!");

    ranking.push({ nome: n, pontos });
    localStorage.setItem("ranking", JSON.stringify(ranking));

    atualizarRanking();
    alert("Pontos registrados!");
}

// SALVAR
function salvar() {
    localStorage.setItem("pontos", pontos);
}
