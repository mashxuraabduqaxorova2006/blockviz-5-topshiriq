// bc-app.js — BlockViz Frontend logic

let myChain = null;

// --- DOM ---
const initBtn       = document.getElementById('initBtn');
const controls      = document.getElementById('controls');
const addBlockBtn   = document.getElementById('addBlockBtn');
const validateBtn   = document.getElementById('validateBtn');
const tamperBtn     = document.getElementById('tamperBtn');
const clearBtn      = document.getElementById('clearBtn');
const dataInput     = document.getElementById('dataInput');
const chainContainer= document.getElementById('chainContainer');
const miningStatus  = document.getElementById('miningStatus');
const miningText    = document.getElementById('miningText');
const logSection    = document.getElementById('logSection');
const logOutput     = document.getElementById('logOutput');
const blockCountEl  = document.getElementById('blockCount');
const chainStatusEl = document.getElementById('chainStatus');

// ---- Custom console logger ----
function log(msg, type = 'info') {
    logSection.style.display = 'block';
    const line = document.createElement('div');
    line.className = `log-${type}`;
    line.textContent = `> ${msg}`;
    logOutput.appendChild(line);
    logOutput.scrollTop = logOutput.scrollHeight;
}

// Patch console.log and console.error to also display in UI
const _origLog   = console.log.bind(console);
const _origError = console.error.bind(console);
console.log   = (...args) => { _origLog(...args);   log(args.join(' '), 'info'); };
console.error = (...args) => { _origError(...args); log(args.join(' '), 'err');  };

// ---- Mining overlay ----
function showMining(msg = 'Mining...') {
    miningStatus.style.display = 'flex';
    miningText.textContent = msg;
}
function hideMining() {
    miningStatus.style.display = 'none';
}

// ---- Render a single block card ----
function renderBlock(block, index, total) {
    const isGenesis = block.index === 0;
    const card = document.createElement('div');
    card.className = `block-card ${isGenesis ? 'genesis' : 'normal'}`;
    card.id = `block-${block.index}`;

    card.innerHTML = `
        <div class="block-label">${isGenesis ? '🌟 Genesis' : '📦 Block'}</div>
        <div class="block-index">#${block.index}</div>

        <div class="block-field">
            <div class="field-label">📅 TIMESTAMP</div>
            <div class="field-value">${new Date(block.timestamp).toLocaleString('uz')}</div>
        </div>

        <div class="block-field">
            <div class="field-label">📝 DATA</div>
            <div class="field-value data-val">${typeof block.data === 'object' ? JSON.stringify(block.data) : block.data}</div>
        </div>

        <div class="block-field">
            <div class="field-label">🔁 NONCE (PoW)</div>
            <div class="field-value nonce-val">${block.nonce}</div>
        </div>

        <div class="block-field">
            <div class="field-label">⬅ PREVIOUS HASH</div>
            <div class="field-value hash-prev">${block.previousHash.slice(0,32)}…</div>
        </div>

        <div class="block-field">
            <div class="field-label">🔐 HASH</div>
            <div class="field-value">${block.hash.slice(0,32)}…</div>
        </div>
    `;
    return card;
}

// ---- Render full chain ----
function renderChain() {
    chainContainer.innerHTML = '';
    myChain.chain.forEach((block, i) => {
        chainContainer.appendChild(renderBlock(block, i, myChain.chain.length));
        if (i < myChain.chain.length - 1) {
            const arrow = document.createElement('div');
            arrow.className = 'chain-arrow';
            arrow.textContent = '→';
            chainContainer.appendChild(arrow);
        }
    });
    blockCountEl.textContent = `📦 Bloklar: ${myChain.chain.length}`;
}

// ---- Update chain validity badge ----
async function updateValidityBadge() {
    const valid = await myChain.isChainValid();
    chainStatusEl.textContent  = valid ? '✅ Zanjir yaroqli' : '❌ Zanjir buzilgan!';
    chainStatusEl.className    = `stat-pill ${valid ? 'valid' : 'invalid'}`;
    // highlight invalid blocks
    if (!valid) {
        document.querySelectorAll('.block-card').forEach(c => c.classList.add('invalid'));
    }
}

// ---- INIT ----
initBtn.addEventListener('click', async () => {
    showMining('Genesis blok yaratilmoqda...');
    log('🚀 Blockchain ishga tushirilmoqda (qiyinlik: 2)...', 'mine');

    // Let UI repaint
    await new Promise(r => setTimeout(r, 50));

    myChain = new Blockchain(2);
    const genesis = await myChain.createGenesisBlock();
    log(`⛏ Genesis mined! Hash: ${genesis.hash}`, 'mine');

    hideMining();
    controls.style.display = 'block';
    renderChain();
    await updateValidityBadge();
    initBtn.textContent = '✅ Blockchain Ishga Tushdi';
    initBtn.disabled = true;
    initBtn.classList.remove('pulse');
});

// ---- ADD BLOCK ----
addBlockBtn.addEventListener('click', async () => {
    const data = dataInput.value.trim();
    if (!data) return;

    showMining(`"${data}" — ma'lumoti mining qilinmoqda...`);
    addBlockBtn.disabled = true;
    log(`📦 Yangi blok qo'shilmoqda: "${data}"`, 'info');

    await new Promise(r => setTimeout(r, 50));
    const newBlock = await myChain.addBlock(data);
    log(`✅ Blok #${newBlock.index} qo'shildi. Nonce: ${newBlock.nonce}`, 'ok');

    hideMining();
    addBlockBtn.disabled = false;
    dataInput.value = '';
    renderChain();
    await updateValidityBadge();
});

// ---- VALIDATE ----
validateBtn.addEventListener('click', async () => {
    log('🔍 Zanjir tekshirilmoqda...', 'info');
    await updateValidityBadge();
});

// ---- TAMPER (Data buzish testi) ----
tamperBtn.addEventListener('click', async () => {
    if (!myChain || myChain.chain.length < 2) {
        log('❌ Buzish uchun kamida 2 ta blok kerak!', 'err');
        return;
    }
    // 1-indeksdagi blokni buzish
    myChain.chain[1].data = '💀 HACKED - Ma\'lumot o\'zgartirildi!';
    log('💥 1-blok ma\'lumoti o\'zgartirildi (buzildi)!', 'err');
    renderChain();
    await updateValidityBadge();
});

// ---- CLEAR ----
clearBtn.addEventListener('click', () => {
    myChain = null;
    chainContainer.innerHTML = '';
    controls.style.display = 'none';
    logOutput.innerHTML = '';
    initBtn.textContent = '🚀 Blockchain\'ni Ishga Tushirish';
    initBtn.disabled = false;
    initBtn.classList.add('pulse');
    blockCountEl.textContent = '📦 Bloklar: 0';
    chainStatusEl.textContent = '✅ Zanjir yaroqli';
    chainStatusEl.className = 'stat-pill valid';
    log('🔄 Blockchain tozalandi.', 'info');
});
