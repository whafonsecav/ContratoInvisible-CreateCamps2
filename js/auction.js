// auction.js - Lógica interactiva para el sistema de Subasta de 10 Lotes
// Carga, Audios (MP3 Fallback a WAV), Tracking de Pujas y Estadísticas.

const auctionData = [
    { id: 1, title: "Iphone 17 Pro Max", baseImg: "LT01", currentBid: 0, bidEvents: 0 },
    { id: 2, title: "Tesla Model Y (Refresh 2025)", baseImg: "LT02", currentBid: 0, bidEvents: 0 },
    { id: 3, title: "Lost Mary OS5000 (Vapeador)", baseImg: "LT03", currentBid: 0, bidEvents: 0 },
    { id: 4, title: "Chocolate KitKat", baseImg: "LT04", currentBid: 0, bidEvents: 0 },
    { id: 5, title: "Nespresso Vertuo (Cápsulas de Café)", baseImg: "LT05", currentBid: 0, bidEvents: 0 },
    { id: 6, title: "Amazon Echo Hub (Alexa)", baseImg: "LT06", currentBid: 0, bidEvents: 0 },
    { id: 7, title: "PlayStation 5 Pro (PSSR Edition)", baseImg: "LT07", currentBid: 0, bidEvents: 0 },
    { id: 8, title: "Nike Air Jordan 1 \"Lost & Found\"", baseImg: "LT08", currentBid: 0, bidEvents: 0 },
    { id: 9, title: "Barebells Protein Bar (Snack Fit)", baseImg: "LT09", currentBid: 0, bidEvents: 0 },
    { id: 10, title: "Lululemon Align™ Pant", baseImg: "LT10", currentBid: 0, bidEvents: 0 }
];

let currentLotIndex = 0;
let currentAudio = null;

// DOM Elements
const elBadge = document.getElementById('lot-badge');
const elTitle = document.getElementById('lot-title');
const elImage = document.getElementById('lot-image');
const elCurrentBid = document.getElementById('display-current-bid');
const elNextBid = document.getElementById('display-next-bid');
const elMatrixGrid = document.getElementById('matrix-grid');
const elAppContainer = document.querySelector('.auction-app-container');
const elStatsContainer = document.getElementById('auction-stats');

// Build the matrix of 20 buttons
function buildMatrix() {
    elMatrixGrid.innerHTML = '';
    for (let i = 1; i <= 20; i++) {
        const btn = document.createElement('button');
        btn.className = 'matrix-btn';
        btn.textContent = `$${i}`;
        btn.onclick = (e) => registerBid(i, e);
        elMatrixGrid.appendChild(btn);
    }
}

// Render specific lot data onto the screen
function renderLot(index) {
    if (index >= auctionData.length) {
        showStats();
        return;
    }

    const lot = auctionData[index];

    // Update Text
    elBadge.textContent = lot.baseImg; // ej: LT01
    elTitle.textContent = lot.title;

    // Load Image (Tries to load logic, defaults to png, can be overridden if needed)
    elImage.src = `assets/imagenes/${lot.baseImg}.jpg`;
    elImage.onerror = () => { elImage.src = `assets/imagenes/${lot.baseImg}.png`; };

    // Reset Display Numbers
    updateBidDisplays(lot.currentBid);

    // Rebuild matrix to reset disabled states
    buildMatrix();
    updateMatrixState(lot.currentBid, lot.isSold);

    // Hook up fresh dedicated audio sources for this lot
    initAudioSources(lot);
}

// Visual update for the big LCD screens
function updateBidDisplays(val) {
    elCurrentBid.textContent = val;
    elNextBid.textContent = val >= 20 ? 'LÍMITE' : (val + 1);
}

// Bidding Action
function registerBid(amount, event) {
    const lot = auctionData[currentLotIndex];
    if (lot.isSold) return; // Block if sold
    if (amount <= lot.currentBid) return; // Only allow higher bids logically

    // Engine updates
    lot.currentBid = amount;
    lot.bidEvents += 1;

    updateBidDisplays(amount);
    updateMatrixState(amount, lot.isSold);
}

function updateMatrixState(currentBid, isSold) {
    document.querySelectorAll('.matrix-btn').forEach(btn => {
        const val = parseInt(btn.textContent.replace('$', ''));
        btn.classList.remove('clicked');

        if (isSold) {
            btn.classList.add('disabled-btn');
        } else if (val <= currentBid) {
            btn.classList.add('disabled-btn');
            if (val === currentBid) btn.classList.add('clicked'); // Highlight the winning one
        } else {
            btn.classList.remove('disabled-btn');
        }
    });

    if (isSold) {
        elNextBid.textContent = "----";
        elCurrentBid.textContent = `¡VENDIDO! $${currentBid}`;
        elCurrentBid.parentElement.parentElement.classList.add('blink-slow');
    } else {
        elCurrentBid.parentElement.parentElement.classList.remove('blink-slow');
    }
}

// Mark lot as sold
function markAsSold() {
    const lot = auctionData[currentLotIndex];
    if (lot.currentBid === 0) return; // Cant sell for 0
    lot.isSold = true;
    updateMatrixState(lot.currentBid, true);

    // Optional: Auto stop music or play hammer sound here if needed
}

// Web Audio API Fallback Beep
function playFallbackBeep() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch beep
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.15); // short beep
    } catch (e) { console.log("WebAudio Fallback failed", e); }
}

// Audio System Variables (Single Player for Bidding)
const audioPlayers = {
    MK: new Audio()
};

function initAudioSources(lot) {
    stopAllAudio();
    const basePath = `assets/audios/${lot.baseImg}`;

    // Config MK Player
    audioPlayers.MK.src = `${basePath}-MK.mp3`;
    audioPlayers.MK.volume = 1.0;
    audioPlayers.MK.onended = () => updateAudioUI('MK', false);
    audioPlayers.MK.onerror = function () {
        if (this.src && this.src.includes('.mp3')) {
            this.src = `${basePath}-MK.wav`;
        }
    };
}

function stopAllAudio() {
    audioPlayers.MK.pause();
    audioPlayers.MK.currentTime = 0;
    updateAudioUI('MK', false);
    stopStatsAudio(); // Also stop any stats audio if playing
}

function stopAudio() {
    stopAllAudio(); // Wrapper for UI stop btn
}

function toggleLotAudio(type) {
    const player = audioPlayers[type];

    if (player.paused) {
        player.play().then(() => {
            updateAudioUI(type, true);
        }).catch(err => {
            console.warn("Audio falló (posible caída a .wav):", err);
            updateAudioUI(type, false);
            playFallbackBeep();
        });
    } else {
        player.pause();
        updateAudioUI(type, false);
    }
}

function restartAudio(type) {
    const player = audioPlayers[type];
    player.currentTime = 0;
    if (player.paused) {
        toggleLotAudio(type);
    }
}

function updateAudioUI(type, isPlaying) {
    // Solo manejamos UI para la subasta principal
    if (!document.getElementById(`audio-group-${type.toLowerCase()}`)) return;

    document.querySelectorAll('.audio-btn-group').forEach(g => {
        g.classList.remove('active-group');
        const i = g.querySelector('.btn-play i');
        if (i) i.setAttribute('data-lucide', 'play');
    });

    if (type && isPlaying) {
        const group = document.getElementById(`audio-group-${type.toLowerCase()}`);
        if (group) {
            group.classList.add('active-group');
            group.querySelector('.btn-play i').setAttribute('data-lucide', 'pause');
        }
    }
    lucide.createIcons();
}

// Navigation
function nextLot() {
    if (currentLotIndex >= auctionData.length - 1) {
        // On last lot → go directly to stats
        currentLotIndex = auctionData.length;
        showStats();
    } else {
        currentLotIndex++;
        renderLot(currentLotIndex);
    }
}

function prevLot() {
    if (currentLotIndex <= 0) return;
    if (currentLotIndex >= auctionData.length) {
        // Coming from stats, go to last lot
        currentLotIndex = auctionData.length - 1;
    } else {
        currentLotIndex--;
    }
    renderLot(currentLotIndex);
}

function goBackToLot() {
    elStatsContainer.classList.add('hidden');
    elAppContainer.classList.remove('hidden');
    currentLotIndex = auctionData.length - 1;
    renderLot(currentLotIndex);
}

// Stats Audio Player
const statsAudioPlayer = new Audio();
let currentStatsPlayingBase = null;

function toggleStatsAudio(baseImg) {
    if (currentStatsPlayingBase === baseImg && !statsAudioPlayer.paused) {
        statsAudioPlayer.pause();
        updateStatsAudioUI(baseImg, false);
        return;
    }

    stopStatsAudio();
    statsAudioPlayer.src = `assets/audios/${baseImg}-IR.mp3`;
    statsAudioPlayer.onerror = function () {
        if (this.src && this.src.includes('.mp3')) {
            this.src = `assets/audios/${baseImg}-IR.wav`;
        }
    };

    statsAudioPlayer.play().then(() => {
        currentStatsPlayingBase = baseImg;
        updateStatsAudioUI(baseImg, true);
    }).catch(e => {
        playFallbackBeep();
        console.warn("Stats audio missing", e);
    });

    statsAudioPlayer.onended = () => {
        updateStatsAudioUI(baseImg, false);
        currentStatsPlayingBase = null;
    };
}

function stopStatsAudio() {
    if (!statsAudioPlayer.paused) {
        statsAudioPlayer.pause();
        statsAudioPlayer.currentTime = 0;
    }
    if (currentStatsPlayingBase) {
        updateStatsAudioUI(currentStatsPlayingBase, false);
        currentStatsPlayingBase = null;
    }
}

function updateStatsAudioUI(baseImg, isPlaying) {
    // Reset all IR play buttons in the table
    document.querySelectorAll('.ir-btn.btn-play').forEach(btn => {
        btn.classList.remove('active');
        btn.innerHTML = '<i data-lucide="play"></i>';
        const group = btn.closest('div');
        if (group) group.classList.remove('active-group');
    });

    if (isPlaying) {
        const activeBtn = document.getElementById(`ir-btn-${baseImg}`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            activeBtn.innerHTML = '<i data-lucide="pause"></i>';
            const group = activeBtn.closest('div');
            if (group) group.classList.add('active-group');
        }
    }
    lucide.createIcons();
}

// Show Final Statistics Screen (Data Table)
function showStats() {
    stopAudio();
    elAppContainer.classList.add('hidden');
    elStatsContainer.classList.remove('hidden');

    // Create a copy to sort without messing up the original index if needed
    const sortedLots = [...auctionData].sort((a, b) => b.currentBid - a.currentBid);
    
    const tbody = document.getElementById('stats-table-body');
    tbody.innerHTML = '';

    sortedLots.forEach((lot) => {
        const tr = document.createElement('tr');
        
        // Highlight row classes based on performance
        if (lot.currentBid === 0) {
            tr.className = 'unsold-row';
        }

        tr.innerHTML = `
            <td><span class="table-badge">${lot.baseImg}</span></td>
            <td><span class="table-title">${lot.title}</span></td>
            <td class="text-right"><strong class="success-text text-lg">$${lot.currentBid}</strong></td>
            <td class="text-center"><span class="table-count text-muted">${lot.bidEvents}</span></td>
            <td class="text-center">
                <div class="audio-btn-group sm-group" id="audio-group-${lot.baseImg.toLowerCase()}">
                    <button class="audio-ctrl btn-play ir-btn" id="ir-btn-${lot.baseImg}" onclick="toggleStatsAudio('${lot.baseImg}')" title="Reproducir/Pausar IR">
                        <i data-lucide="play"></i>
                    </button>
                    <button class="audio-ctrl btn-restart ir-btn" onclick="stopStatsAudio()" title="Detener">
                        <i data-lucide="square"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    lucide.createIcons();
}

// Init when page loads
document.addEventListener('DOMContentLoaded', () => {
    buildMatrix();
    renderLot(currentLotIndex);
});
