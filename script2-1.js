/* ========= DADOS INICIAIS ========== */

// dicas e posts iniciais (pode editar, adicionar ou carregar via API)
const DICAS = [
    "Use lâmpadas de LED para economizar energia.",
    "Reduza o tempo do banho para economizar água.",
    "Separe o lixo reciclável: plástico, papel, vidro e metal.",
    "Leve sua sacola reutilizável ao mercado.",
    "Prefira transporte ativo quando possível (caminhar, pedalar).",
    "Plante e cuide de árvores e plantas nativas.",
];

const POSTS = [
    {
        id: "p1",
        title: "Como reciclar corretamente",
        excerpt: "Aprenda os passos básicos para separar e descartar resíduos.",
        content: "<p>Reciclar começa em casa: limpe os recipientes, separe por tipo e informe-se sobre o serviço de coleta local.</p>",
        date: "2025-06-10"
    },
    {
        id: "p2",
        title: "Economizando água no dia a dia",
        excerpt: "Pequenas mudanças que reduzem muito o consumo.",
        content: "<p>Conserte vazamentos, reaproveite água da chuva e use filtros de baixa vazão.</p>",
        date: "2025-07-03"
    },
    {
        id: "p3",
        title: "Plante uma árvore: guia rápido",
        excerpt: "Porque plantar é um ato simples com grande impacto.",
        content: "<p>Escolha espécies nativas, prepare o solo e regue nos primeiros meses.</p>",
        date: "2025-08-18"
    }
];

/* ========= ELEMENTOS ========== */
const busca = document.getElementById("buscador");
const contadorGlobalEl = document.getElementById("contadorGlobal");
const totalDicasEl = document.getElementById("totalDicas");
const dicaTextoEl = document.getElementById("dicaTexto");
const novaDicaBtn = document.getElementById("novaDicaBtn");
const btnOutraDica = document.getElementById("btnOutraDica");
const postsGrid = document.getElementById("postsGrid");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalViews = document.getElementById("modalViews");
const modalDate = document.getElementById("modalDate");
const modalClose = document.getElementById("modalClose");
const temaToggle = document.getElementById("temaToggle");
const iconTema = document.getElementById("iconTema");
const btnVerDicas = document.getElementById("btnVerDicas");
const btnVerPosts = document.getElementById("btnVerPosts");
const areaDicas = document.getElementById("areaDicas");
const areaPosts = document.getElementById("areaPosts");
const novaDicaAction = document.getElementById("novaDicaBtn");

/* ========= LOCALSTORAGE KEYS ========== */
const LS_VIEWS = "gd_views_total";
const LS_POST_VIEWS = "gd_post_views";
const LS_THEME = "gd_theme";

/* ========= INICIALIZAÇÃO ========== */

// contador global de visualizações
let views = Number(localStorage.getItem(LS_VIEWS)) || 0;
views++;
localStorage.setItem(LS_VIEWS, views);
contadorGlobalEl.textContent = views;

// post views (por id)
let postViews = JSON.parse(localStorage.getItem(LS_POST_VIEWS)) || {};

// tema
const savedTheme = localStorage.getItem(LS_THEME) || "light";
applyTheme(savedTheme);

// popular número total de dicas
totalDicasEl.textContent = DICAS.length;

// render inicial
renderDicaAleatoria();
renderPostsGrid(POSTS);
setupEventListeners();

/* ========= FUNÇÕES ========== */

function applyTheme(theme){
    if(theme === "dark"){
        document.documentElement.classList.add("dark");
        iconTema.textContent = "light_mode";
    } else {
        document.documentElement.classList.remove("dark");
        iconTema.textContent = "dark_mode";
    }
    localStorage.setItem(LS_THEME, theme);
}

function toggleTheme(){
    const isDark = document.documentElement.classList.contains("dark");
    applyTheme(isDark ? "light" : "dark");
}

function renderDicaAleatoria(){
    const idx = Math.floor(Math.random() * DICAS.length);
    dicaTextoEl.textContent = DICAS[idx];
}

function renderPostsGrid(posts){
    postsGrid.innerHTML = "";
    posts.forEach(p => {
        const card = document.createElement("article");
        card.className = "card";
        card.tabIndex = 0;
        card.dataset.id = p.id;
        card.innerHTML = `
            <h4>${p.title}</h4>
            <p>${p.excerpt}</p>
            <div class="meta">
                <span class="viewsSmall">👁️ ${postViews[p.id] || 0}</span>
                <span>${p.date}</span>
            </div>
        `;
        // click e teclado para abrir
        card.addEventListener("click", ()=> openPost(p.id));
        card.addEventListener("keydown", (e)=> { if(e.key === "Enter") openPost(p.id); });
        postsGrid.appendChild(card);
    });
}

function openPost(id){
    const post = POSTS.find(p => p.id === id);
    if(!post) return;
    // incrementar view do post
    postViews[id] = (postViews[id] || 0) + 1;
    localStorage.setItem(LS_POST_VIEWS, JSON.stringify(postViews));
    // atualizar contador global também (opcional)
    views++;
    localStorage.setItem(LS_VIEWS, views);
    contadorGlobalEl.textContent = views;
    // preencher modal
    modalTitle.textContent = post.title;
    modalDate.textContent = post.date;
    modalBody.innerHTML = post.content;
    modalViews.textContent = `${postViews[id] || 0} visualizações`;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden","false");
}

function closeModal(){
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden","true");
}

function buscar(){
    const termo = busca.value.trim().toLowerCase();
    // filtrar posts por título/excerpt
    const postsFiltrados = POSTS.filter(p => (p.title + " " + p.excerpt + " " + p.content).toLowerCase().includes(termo));
    renderPostsGrid(postsFiltrados);

    // filtrar dica: se o texto atual contém termo, mostra áreaDicas, senão oculta
    const dicaAtual = (dicaTextoEl.textContent || "").toLowerCase();
    if(dicaAtual.includes(termo) || termo === ""){
        areaDicas.classList.add("active");
        areaDicas.style.display = "";
    } else {
        areaDicas.style.display = "none";
    }
}

/* abrir/fechar painéis */
function showPanel(panel){
    if(panel === "dicas"){
        areaDicas.style.display = "";
        areaPosts.style.display = "none";
        btnVerDicas.classList.add("filled");
        btnVerPosts.classList.remove("filled");
    } else {
        areaPosts.style.display = "";
        areaDicas.style.display = "none";
        btnVerPosts.classList.add("filled");
        btnVerDicas.classList.remove("filled");
    }
}

/* adicionar nova dica via prompt simples */
function adicionarNovaDica(){
    const texto = prompt("Digite a nova dica ambiental:");
    if(texto && texto.trim().length > 5){
        DICAS.unshift(texto.trim());
        totalDicasEl.textContent = DICAS.length;
        renderDicaAleatoria();
        alert("Dica adicionada!");
    } else {
        alert("Dica inválida (mínimo de 6 caracteres).");
    }
}

/* eventos */
function setupEventListeners(){
    busca.addEventListener("input", () => buscar());
    novaDicaBtn.addEventListener("click", adicionarNovaDica);
    btnOutraDica.addEventListener("click", renderDicaAleatoria);
    modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", (e)=> { if(e.target === modal) closeModal(); });
    temaToggle.addEventListener("click", toggleTheme);
    btnVerDicas.addEventListener("click", ()=> showPanel("dicas"));
    btnVerPosts.addEventListener("click", ()=> showPanel("posts"));

    // keyboard esc fecha modal
    window.addEventListener("keydown", (e)=>{
        if(e.key === "Escape") closeModal();
    });
}
