/* --- TECHNOVA CORE V21 --- */

const inventory = [
    { id: 101, category: 'perifericos', name: "Adaptador USB", price: 2499.00, img: "images/bt-53.jpg" },
    { id: 102, category: 'perifericos', name: "Cabo 100w", price: 850.00, img: "images/cabo-100w.jpg" },
    { id: 103, category: 'perifericos', name: "Fone Bluetooth", price: 420.00, img: "images/fone-bt.jpg" },
    { id: 104, category: 'hardware', name: "Hub 7 em 1", price: 3200.00, img: "images/hub-7em1.jpg" },
    { id: 105, category: 'hardware', name: "Mouse sem fio", price: 1500.00, img: "images/mouse.jpg" },
    { id: 106, category: 'componentes', name: "Teclado sei lá", price: 150.00, img: "images/teclado.jpg" },
    { id: 107, category: 'componentes', name: "Suporte para Celular", price: 5000.00, img: "images/suporte-celular.jpg" },
    { id: 108, category: 'hardware', name: "PowerBank 2000MaH", price: 1200.00, img: "images/powerbank-20000.jpg" }
];

const articlesDB = {
    1: { tag: "ORIGEM • WI-FI", title: "Buracos Negros & Wi-Fi", body: "<p>A tecnologia Wi-Fi nasceu da pesquisa de John O'Sullivan sobre buracos negros na Austrália.</p>" },
    2: { tag: "HISTÓRIA • 1947", title: "O Primeiro Bug Real", body: "<p>Em 1947, Grace Hopper encontrou uma mariposa presa em um relé do computador Harvard Mark II.</p>" },
    3: { tag: "CURIOSIDADE • CAFÉ", title: "A Primeira Webcam", body: "<p>Criada em Cambridge apenas para vigiar uma cafeteira e evitar viagens perdidas.</p>" }
};

/* --- NAVEGAÇÃO --- */
window.switchTab = (tab) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('view-brand').classList.toggle('active', tab === 'brand');
    document.getElementById('view-store').classList.toggle('active', tab === 'store');
    document.querySelectorAll('.nav-item').forEach(btn => {
        const isTarget = btn.textContent.toLowerCase().includes(tab === 'brand' ? 'corp' : 'loja');
        btn.classList.toggle('active', isTarget);
    });
};
window.scrollToId = (id) => document.getElementById(id).scrollIntoView({ behavior: 'smooth' });

/* --- TETRIS --- */
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20, 20);

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length -1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) { if (arena[y][x] === 0) continue outer; }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        player.score += rowCount * 10;
        rowCount *= 2;
    }
}
function collide(arena, player) {
    const m = player.matrix, o = player.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) return true;
        }
    }
    return false;
}
function createMatrix(w, h) {
    const matrix = [];
    while (h--) matrix.push(new Array(w).fill(0));
    return matrix;
}
function createPiece(type) {
    if (type === 'I') return [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]];
    if (type === 'L') return [[0, 2, 0], [0, 2, 0], [0, 2, 2]];
    if (type === 'J') return [[0, 3, 0], [0, 3, 0], [3, 3, 0]];
    if (type === 'O') return [[4, 4], [4, 4]];
    if (type === 'Z') return [[5, 5, 0], [0, 5, 5], [0, 0, 0]];
    if (type === 'S') return [[0, 6, 6], [6, 6, 0], [0, 0, 0]];
    if (type === 'T') return [[0, 7, 0], [7, 7, 7], [0, 0, 0]];
}
function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = ['null', '#FF0D72', '#0DC2FF', '#0DFF72', '#F538FF', '#FF8E0D', '#FFE138', '#3877FF'][value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}
function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}
function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => { if (value !== 0) arena[y + player.pos.y][x + player.pos.x] = value; });
    });
}
function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--; merge(arena, player); playerReset(); arenaSweep(); updateScore();
    }
    dropCounter = 0;
}
function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) player.pos.x -= dir;
}
function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) { arena.forEach(row => row.fill(0)); player.score = 0; updateScore(); }
}
function playerRotate(dir) {
    const pos = player.pos.x; let offset = 1; rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset; offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) { rotate(player.matrix, -dir); player.pos.x = pos; return; }
    }
}
function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) { [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]]; }
    }
    if (dir > 0) matrix.forEach(row => row.reverse()); else matrix.reverse();
}
let dropCounter = 0; let dropInterval = 1000; let lastTime = 0; let isPlaying = false;
function update(time = 0) {
    if(!isPlaying) return;
    const deltaTime = time - lastTime; lastTime = time; dropCounter += deltaTime;
    if (dropCounter > dropInterval) playerDrop();
    draw(); requestAnimationFrame(update);
}
function updateScore() { document.getElementById('score').innerText = "SCORE: " + player.score; }
const arena = createMatrix(12, 20);
const player = { pos: {x: 0, y: 0}, matrix: null, score: 0 };
document.addEventListener('keydown', event => {
    if(!isPlaying) return;
    if (event.keyCode === 37) playerMove(-1);
    else if (event.keyCode === 39) playerMove(1);
    else if (event.keyCode === 40) playerDrop();
    else if (event.keyCode === 38) playerRotate(1);
});
document.getElementById('start-tetris').addEventListener('click', () => {
    if(!isPlaying) { playerReset(); updateScore(); isPlaying = true; update(); document.getElementById('start-tetris').innerText = "REINICIAR"; }
    else { arena.forEach(row => row.fill(0)); player.score = 0; playerReset(); }
});

/* --- UI HELPERS --- */
const tWrap = document.getElementById('tetris-wrapper');
document.getElementById('tetris-toggle-btn').addEventListener('click', () => {
    tWrap.classList.toggle('minimized');
    if(tWrap.classList.contains('minimized')) isPlaying = false;
});

/* --- LOJA & FILTROS --- */
const productGrid = document.getElementById('product-grid');
let cart = [];
function renderStore(list) {
    if(productGrid) {
        if(list.length === 0) { productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Nenhum produto encontrado.</p>'; return; }
        productGrid.innerHTML = list.map(item => `
            <div class="product-card">
                <img src="${item.img}" class="product-img" loading="lazy">
                <h3>${item.name}</h3>
                <span class="product-price">R$ ${item.price.toFixed(2)}</span>
                <button class="btn primary full" onclick="addToCart(${item.id})"><i class="fas fa-plus"></i> Adicionar</button>
            </div>
        `).join('');
    }
}
function initFilters() {
    const searchInput = document.getElementById('store-search');
    const filterBtns = document.querySelectorAll('.chip');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active');
            const cat = btn.getAttribute('data-filter');
            const filtered = cat === 'all' ? inventory : inventory.filter(item => item.category === cat);
            renderStore(filtered);
        });
    });
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = inventory.filter(item => item.name.toLowerCase().includes(term));
        renderStore(filtered);
    });
}
window.addToCart = (id) => {
    const item = inventory.find(p => p.id === id);
    const existing = cart.find(c => c.id === id);
    if(existing) existing.qty++; else cart.push({ ...item, qty: 1 });
    updateCartUI(); openSidebar();
};
function updateCartUI() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('cart-count');
    countEl.innerText = cart.reduce((acc, c) => acc + c.qty, 0);
    if(cart.length === 0) container.innerHTML = `<p style="text-align:center; color:var(--text-muted); margin-top:20px;">Vazio.</p>`;
    else {
        container.innerHTML = cart.map(item => `
            <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid var(--glass-border); padding-bottom:10px;">
                <div><b>${item.name}</b><br><small>Qtd: ${item.qty}</small></div>
                <div style="color:var(--neon-cyan);">R$ ${(item.price * item.qty).toFixed(2)}</div>
            </div>
        `).join('');
    }
    const total = cart.reduce((acc, c) => acc + (c.price * c.qty), 0);
    totalEl.innerText = `R$ ${total.toFixed(2)}`;
}

// === LÓGICA DE LIMPAR CARRINHO ===
document.getElementById('btn-clear-cart').addEventListener('click', () => {
    if(cart.length > 0 && confirm('Esvaziar carrinho?')) {
        cart = [];
        updateCartUI();
    }
});

const sidebar = document.getElementById('cart-sidebar');
function openSidebar() { sidebar.classList.add('active'); document.getElementById('overlay-bg').classList.add('active'); }
function closeAll() {
    sidebar.classList.remove('active'); document.getElementById('overlay-bg').classList.remove('active');
    document.getElementById('article-modal').classList.remove('active');
    document.getElementById('checkout-modal').classList.remove('active');
}
document.getElementById('cart-btn').addEventListener('click', openSidebar);
document.querySelectorAll('.close-sidebar, .close-modal').forEach(el => el.addEventListener('click', closeAll));
document.getElementById('overlay-bg').addEventListener('click', closeAll);

/* --- CHECKOUT --- */
const checkoutModal = document.getElementById('checkout-modal');
document.getElementById('btn-checkout-start').addEventListener('click', () => {
    if(cart.length === 0) return alert("Vazio.");
    closeAll(); checkoutModal.classList.add('active'); document.getElementById('overlay-bg').classList.add('active'); goToStep(1);
});
window.nextStep = (n) => {
    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${n}`).classList.add('active');
    document.getElementById('progress-fill').style.width = (n === 1 ? '33%' : n === 2 ? '66%' : '100%');
}
window.processPayment = () => {
    goToStep(3); setTimeout(() => { goToStep(4); cart = []; updateCartUI(); }, 1000);
};
window.closeCheckout = closeAll;

const artModal = document.getElementById('article-modal');
window.openArticle = (id) => {
    const art = articlesDB[id];
    if(art) {
        document.getElementById('art-tag').innerText = art.tag; document.getElementById('art-title').innerText = art.title;
        document.getElementById('art-body').innerHTML = art.body;
        document.getElementById('art-img').style.backgroundImage = `url('https://source.unsplash.com/random/800x400/?technology,futuristic,sig=${id}')`;
        artModal.classList.add('active'); document.getElementById('overlay-bg').classList.add('active');
    }
};
document.querySelector('.close-modal.white-bg').addEventListener('click', closeAll);

/* --- UTILS --- */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; el.style.transition = 'all 0.6s ease-out'; observer.observe(el); });

document.getElementById('theme-toggle').addEventListener('click', function() {
    const body = document.body; const icon = this.querySelector('i');
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
});

// INIT
renderStore(inventory); initFilters(); 
// CORREÇÃO TELA PRETA: Desenha o jogo logo ao carregar
playerReset();
draw();