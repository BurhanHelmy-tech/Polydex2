/* ============================================
   POLYDEX — APP LOGIC
   Geometric Encyclopedia Engine
   ============================================ */

// =============================
// DATA: 8 Regular Polygons
// =============================
const POLYDEX_DATA = [
    {
        id: "POL-001",
        namaBM: "Segi Tiga",
        nameEN: "Triangle",
        sisi: 3,
        bucu: 3,
        pepenjuru: 0,             // 3(3-3)/2 = 0
        sudutPedalaman: 180,      // (3-2)×180 = 180
        color: "#00f0ff",
        colorGlow: "rgba(0, 240, 255, 0.25)",
        colorSecondary: "#00c4d4",
        image: "images/triangle.png"
    },
    {
        id: "POL-002",
        namaBM: "Segi Empat",
        nameEN: "Square",
        sisi: 4,
        bucu: 4,
        pepenjuru: 2,             // 4(4-3)/2 = 2
        sudutPedalaman: 360,      // (4-2)×180 = 360
        color: "#2d7bff",
        colorGlow: "rgba(45, 123, 255, 0.25)",
        colorSecondary: "#1a5fd4",
        image: "images/square.png"
    },
    {
        id: "POL-003",
        namaBM: "Pentagon",
        nameEN: "Pentagon",
        sisi: 5,
        bucu: 5,
        pepenjuru: 5,             // 5(5-3)/2 = 5
        sudutPedalaman: 540,      // (5-2)×180 = 540
        color: "#7b2fff",
        colorGlow: "rgba(123, 47, 255, 0.25)",
        colorSecondary: "#6020d4",
        image: "images/pentagon.png"
    },
    {
        id: "POL-004",
        namaBM: "Heksagon",
        nameEN: "Hexagon",
        sisi: 6,
        bucu: 6,
        pepenjuru: 9,             // 6(6-3)/2 = 9
        sudutPedalaman: 720,      // (6-2)×180 = 720
        color: "#ff006e",
        colorGlow: "rgba(255, 0, 110, 0.25)",
        colorSecondary: "#cc0058",
        image: "images/hexagon.png"
    },
    {
        id: "POL-005",
        namaBM: "Heptagon",
        nameEN: "Heptagon",
        sisi: 7,
        bucu: 7,
        pepenjuru: 14,            // 7(7-3)/2 = 14
        sudutPedalaman: 900,      // (7-2)×180 = 900
        color: "#00ff88",
        colorGlow: "rgba(0, 255, 136, 0.25)",
        colorSecondary: "#00cc6e",
        image: "images/heptagon.png"
    },
    {
        id: "POL-006",
        namaBM: "Oktagon",
        nameEN: "Octagon",
        sisi: 8,
        bucu: 8,
        pepenjuru: 20,            // 8(8-3)/2 = 20
        sudutPedalaman: 1080,     // (8-2)×180 = 1080
        color: "#ffaa00",
        colorGlow: "rgba(255, 170, 0, 0.25)",
        colorSecondary: "#cc8800",
        image: "images/octagon.png"
    },
    {
        id: "POL-007",
        namaBM: "Nonagon",
        nameEN: "Nonagon",
        sisi: 9,
        bucu: 9,
        pepenjuru: 27,            // 9(9-3)/2 = 27
        sudutPedalaman: 1260,     // (9-2)×180 = 1260
        color: "#ff4d6a",
        colorGlow: "rgba(255, 77, 106, 0.25)",
        colorSecondary: "#e63355",
        image: "images/nonagon.png"
    },
    {
        id: "POL-008",
        namaBM: "Dekagon",
        nameEN: "Decagon",
        sisi: 10,
        bucu: 10,
        pepenjuru: 35,            // 10(10-3)/2 = 35
        sudutPedalaman: 1440,     // (10-2)×180 = 1440
        color: "#00d4ff",
        colorGlow: "rgba(0, 212, 255, 0.25)",
        colorSecondary: "#00a8cc",
        image: "images/decagon.png"
    }
];

// =============================
// STATE
// =============================
let activeIndex = 0;
let isTransitioning = false;

// =============================
// DOM REFERENCES
// =============================
const DOM = {
    shapeCanvas: document.getElementById('shapeCanvas'),
    shapeGlow: document.getElementById('shapeGlow'),
    shapeFloatingLabel: document.getElementById('shapeFloatingLabel'),
    shapeIdentity: document.getElementById('shapeIdentity'),
    shapeIdBadge: document.getElementById('shapeIdBadge'),
    shapeNameBM: document.getElementById('shapeNameBM'),
    shapeNameEN: document.getElementById('shapeNameEN'),
    shapeClassification: document.getElementById('shapeClassification'),
    pokemonImage: document.getElementById('pokemonImage'),
    statSisiVal: document.getElementById('statSisiVal'),
    statBucuVal: document.getElementById('statBucuVal'),
    statDiagVal: document.getElementById('statDiagVal'),
    statAngleVal: document.getElementById('statAngleVal'),
    statSisiBar: document.getElementById('statSisiBar'),
    statBucuBar: document.getElementById('statBucuBar'),
    statDiagBar: document.getElementById('statDiagBar'),
    statAngleBar: document.getElementById('statAngleBar'),
    formulaDiag: document.getElementById('formulaDiag'),
    formulaAngle: document.getElementById('formulaAngle'),
    searchInput: document.getElementById('searchInput'),
    filteredCount: document.getElementById('filteredCount'),
    totalCount: document.getElementById('totalCount'),
    shapeGrid: document.getElementById('shapeGrid'),
    bgParticles: document.getElementById('bgParticles'),
    leftPanel: document.getElementById('leftPanel')
};

// =============================
// DRAWING ENGINE
// =============================

/**
 * Draw a regular polygon on a canvas context
 */
function drawRegularPolygon(ctx, centerX, centerY, radius, sides, options = {}) {
    const {
        strokeColor = '#00f0ff',
        fillColor = 'rgba(0, 240, 255, 0.03)',
        lineWidth = 2,
        glowColor = 'rgba(0, 240, 255, 0.4)',
        glowRadius = 15,
        showVertices = true,
        showDiagonals = false,
        rotation = -Math.PI / 2  // start from top
    } = options;

    const angleStep = (2 * Math.PI) / sides;
    const vertices = [];

    // Calculate vertices
    for (let i = 0; i < sides; i++) {
        const angle = rotation + i * angleStep;
        vertices.push({
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        });
    }

    // Draw diagonals (subtle)
    if (showDiagonals && sides > 3) {
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
        ctx.lineWidth = 0.5;
        ctx.setLineDash([4, 6]);
        for (let i = 0; i < sides; i++) {
            for (let j = i + 2; j < sides; j++) {
                if (j === i + sides - 1) continue; // skip adjacent
                ctx.beginPath();
                ctx.moveTo(vertices[i].x, vertices[i].y);
                ctx.lineTo(vertices[j].x, vertices[j].y);
                ctx.stroke();
            }
        }
        ctx.restore();
    }

    // Draw fill
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        if (i === 0) ctx.moveTo(vertices[i].x, vertices[i].y);
        else ctx.lineTo(vertices[i].x, vertices[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();

    // Draw glow
    ctx.save();
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = glowRadius;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        if (i === 0) ctx.moveTo(vertices[i].x, vertices[i].y);
        else ctx.lineTo(vertices[i].x, vertices[i].y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    // Draw secondary inner glow line
    ctx.save();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.3;
    const innerRadius = radius * 0.85;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        const angle = rotation + i * angleStep;
        const x = centerX + innerRadius * Math.cos(angle);
        const y = centerY + innerRadius * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    // Draw vertices
    if (showVertices) {
        vertices.forEach((v) => {
            // Outer glow
            ctx.beginPath();
            ctx.arc(v.x, v.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = glowColor;
            ctx.fill();

            // Inner dot
            ctx.beginPath();
            ctx.arc(v.x, v.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = strokeColor;
            ctx.fill();
        });
    }

    return vertices;
}

/**
 * Draw the main active shape on the left panel
 */
function drawActiveShape(shape, animationPhase = 0) {
    const canvas = DOM.shapeCanvas;
    const ctx = canvas.getContext('2d');

    // Handle DPR
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = 300;
    const displayHeight = 300;
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    canvas.style.width = displayWidth + 'px';
    canvas.style.height = displayHeight + 'px';
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, displayWidth, displayHeight);

    const cx = displayWidth / 2;
    const cy = displayHeight / 2;
    const radius = 100;

    // Subtle rotation animation
    const rotationOffset = animationPhase * 0.0003;

    drawRegularPolygon(ctx, cx, cy, radius, shape.sisi, {
        strokeColor: shape.color,
        fillColor: shape.color.replace(')', ', 0.04)').replace('rgb', 'rgba').replace('#', '#') ?
            hexToRGBA(shape.color, 0.04) : 'rgba(0,240,255,0.04)',
        lineWidth: 2,
        glowColor: shape.colorGlow,
        glowRadius: 20,
        showVertices: true,
        showDiagonals: true,
        rotation: -Math.PI / 2 + rotationOffset
    });
}

/**
 * Draw a small shape for grid card thumbnails
 */
function drawGridShape(canvas, shape, isActive = false) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = 80;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, size, size);

    drawRegularPolygon(ctx, size / 2, size / 2, 28, shape.sisi, {
        strokeColor: isActive ? shape.color : shape.colorSecondary,
        fillColor: isActive ? hexToRGBA(shape.color, 0.08) : 'transparent',
        lineWidth: isActive ? 2 : 1.5,
        glowColor: isActive ? shape.colorGlow : 'transparent',
        glowRadius: isActive ? 12 : 0,
        showVertices: false,
        showDiagonals: false,
        rotation: -Math.PI / 2
    });
}

// =============================
// UTILITY
// =============================

function hexToRGBA(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function animateValue(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    element.classList.add('counting');
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quart
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(start + (end - start) * eased);
        element.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = end + suffix;
            element.classList.remove('counting');
        }
    }
    requestAnimationFrame(update);
}

// =============================
// UI UPDATE
// =============================

function updateActiveDisplay(index, animate = true) {
    if (isTransitioning) return;
    if (index === activeIndex && animate) return;

    isTransitioning = true;
    const shape = POLYDEX_DATA[index];
    const previousShape = POLYDEX_DATA[activeIndex];

    if (animate) {
        // Fade out identity
        DOM.shapeIdentity.classList.add('fade-out');

        // Flash overlay
        let overlay = DOM.leftPanel.querySelector('.shape-transition-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'shape-transition-overlay';
            DOM.leftPanel.appendChild(overlay);
        }
        overlay.classList.add('flash');

        setTimeout(() => {
            overlay.classList.remove('flash');
        }, 400);

        setTimeout(() => {
            applyShapeData(shape, previousShape, index);
            DOM.shapeIdentity.classList.remove('fade-out');
            isTransitioning = false;
        }, 300);
    } else {
        applyShapeData(shape, previousShape, index);
        isTransitioning = false;
    }

    activeIndex = index;
    updateGridActiveState(index);
}

function applyShapeData(shape, previousShape, index) {
    // Update identity
    DOM.shapeIdBadge.textContent = shape.id;
    DOM.shapeNameBM.textContent = shape.namaBM;
    DOM.shapeNameEN.textContent = shape.nameEN;

    // Classification
    DOM.shapeClassification.innerHTML = `
        <span class="class-tag">Poligon Sekata</span>
        <span class="class-tag">${shape.sisi} Sisi</span>
    `;

    // Glow color
    DOM.shapeGlow.style.background = `radial-gradient(circle, ${shape.colorGlow} 0%, transparent 70%)`;

    // Floating label
    DOM.shapeFloatingLabel.textContent = `${shape.sisi}-GON REGULAR`;

    // Draw shape
    drawActiveShape(shape);

    // Update Pokemon image
    if (DOM.pokemonImage) {
        DOM.pokemonImage.classList.add('pokemon-fade-out');
        setTimeout(() => {
            DOM.pokemonImage.src = shape.image;
            DOM.pokemonImage.alt = shape.namaBM + ' Pokemon';
            DOM.pokemonImage.classList.remove('pokemon-fade-out');
            DOM.pokemonImage.classList.add('pokemon-fade-in');
            setTimeout(() => {
                DOM.pokemonImage.classList.remove('pokemon-fade-in');
            }, 500);
        }, 200);
    }

    // Animate stat values
    const maxSisi = 10;
    const maxDiag = 35;
    const maxAngle = 1440;

    animateValue(DOM.statSisiVal, previousShape ? previousShape.sisi : 0, shape.sisi, 500);
    animateValue(DOM.statBucuVal, previousShape ? previousShape.bucu : 0, shape.bucu, 500);
    animateValue(DOM.statDiagVal, previousShape ? previousShape.pepenjuru : 0, shape.pepenjuru, 600);
    animateValue(DOM.statAngleVal, previousShape ? previousShape.sudutPedalaman : 0, shape.sudutPedalaman, 700, '°');

    // Stat bars
    setTimeout(() => {
        DOM.statSisiBar.style.width = `${(shape.sisi / maxSisi) * 100}%`;
        DOM.statBucuBar.style.width = `${(shape.bucu / maxSisi) * 100}%`;
        DOM.statDiagBar.style.width = `${(shape.pepenjuru / maxDiag) * 100}%`;
        DOM.statAngleBar.style.width = `${(shape.sudutPedalaman / maxAngle) * 100}%`;
    }, 100);

    // Stat bar colors
    const barColor = shape.color;
    DOM.statSisiBar.style.background = `linear-gradient(90deg, ${barColor}, ${shape.colorSecondary})`;
    DOM.statBucuBar.style.background = `linear-gradient(90deg, ${barColor}, ${shape.colorSecondary})`;
    DOM.statDiagBar.style.background = `linear-gradient(90deg, ${barColor}, ${shape.colorSecondary})`;
    DOM.statAngleBar.style.background = `linear-gradient(90deg, ${barColor}, ${shape.colorSecondary})`;

    // Formulas
    const n = shape.sisi;
    DOM.formulaDiag.textContent = `n(n−3)/2 = ${n}(${n}−3)/2 = ${shape.pepenjuru}`;
    DOM.formulaAngle.textContent = `(n−2)×180° = (${n}−2)×180° = ${shape.sudutPedalaman}°`;
}

// =============================
// GRID CARDS
// =============================

function createGridCards() {
    DOM.shapeGrid.innerHTML = '';

    POLYDEX_DATA.forEach((shape, index) => {
        const card = document.createElement('div');
        card.className = 'grid-card' + (index === 0 ? ' active' : '');
        card.dataset.index = index;
        card.dataset.namaBM = shape.namaBM.toLowerCase();
        card.dataset.nameEN = shape.nameEN.toLowerCase();
        card.dataset.sisi = shape.sisi;
        card.style.animationDelay = `${index * 60}ms`;

        // Pokemon thumbnail image
        const thumbImg = document.createElement('img');
        thumbImg.className = 'grid-card-pokemon';
        thumbImg.src = shape.image;
        thumbImg.alt = shape.namaBM;
        thumbImg.loading = 'lazy';
        thumbImg.style.setProperty('--float-delay', `${index * 0.4}s`);

        const info = document.createElement('div');
        info.className = 'grid-card-info';
        info.innerHTML = `
            <span class="grid-card-name">${shape.namaBM.toUpperCase()}</span>
            <span class="grid-card-en">${shape.nameEN}</span>
            <span class="grid-card-sides">${shape.sisi} SISI · ${shape.pepenjuru} PEPENJURU</span>
        `;

        card.appendChild(thumbImg);
        card.appendChild(info);

        // Click handler
        card.addEventListener('click', () => {
            if (index !== activeIndex) {
                updateActiveDisplay(index, true);
            }
        });

        DOM.shapeGrid.appendChild(card);
    });

    // No results placeholder
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.id = 'noResults';
    noResults.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="7"/>
            <line x1="16.5" y1="16.5" x2="21" y2="21"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
        <p>Tiada bentuk dijumpai</p>
    `;
    DOM.shapeGrid.appendChild(noResults);
}

function updateGridActiveState(activeIdx) {
    const cards = DOM.shapeGrid.querySelectorAll('.grid-card');
    cards.forEach((card, i) => {
        const idx = parseInt(card.dataset.index);
        const isActive = idx === activeIdx;
        card.classList.toggle('active', isActive);
    });
}

// =============================
// SEARCH
// =============================

function handleSearch() {
    const query = DOM.searchInput.value.trim().toLowerCase();
    const cards = DOM.shapeGrid.querySelectorAll('.grid-card');
    const noResults = document.getElementById('noResults');
    let visibleCount = 0;

    cards.forEach(card => {
        const namaBM = card.dataset.namaBM;
        const nameEN = card.dataset.nameEN;
        const sisi = card.dataset.sisi;

        const matches = !query ||
            namaBM.includes(query) ||
            nameEN.includes(query) ||
            sisi === query ||
            (query === 'segi' && namaBM.includes('segi')) ||
            (`${sisi} sisi`.includes(query));

        card.classList.toggle('hidden', !matches);
        if (matches) visibleCount++;
    });

    DOM.filteredCount.textContent = visibleCount;

    if (noResults) {
        noResults.classList.toggle('visible', visibleCount === 0);
    }
}

// =============================
// BACKGROUND PARTICLES
// =============================

function createParticles() {
    const container = DOM.bgParticles;
    const count = 30;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'bg-particle';

        const size = Math.random() * 3 + 1;
        const left = Math.random() * 100;
        const duration = Math.random() * 20 + 15;
        const delay = Math.random() * 20;
        const opacity = Math.random() * 0.3 + 0.05;

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            opacity: ${opacity};
        `;

        container.appendChild(particle);
    }
}

// =============================
// SHAPE ANIMATION LOOP
// =============================

let animationFrame = 0;
function startShapeAnimation() {
    function loop(timestamp) {
        animationFrame = timestamp;
        const shape = POLYDEX_DATA[activeIndex];
        drawActiveShape(shape, timestamp);
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

// =============================
// KEYBOARD SHORTCUTS
// =============================

function setupKeyboard() {
    document.addEventListener('keydown', (e) => {
        // Ctrl+K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            DOM.searchInput.focus();
            DOM.searchInput.select();
        }

        // Escape to clear search
        if (e.key === 'Escape') {
            DOM.searchInput.value = '';
            DOM.searchInput.blur();
            handleSearch();
        }

        // Arrow keys to navigate shapes (when search not focused)
        if (document.activeElement !== DOM.searchInput) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const next = (activeIndex + 1) % POLYDEX_DATA.length;
                updateActiveDisplay(next, true);
            }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prev = (activeIndex - 1 + POLYDEX_DATA.length) % POLYDEX_DATA.length;
                updateActiveDisplay(prev, true);
            }
        }
    });
}

// =============================
// INITIALIZATION
// =============================

function init() {
    // Set total count
    DOM.totalCount.textContent = POLYDEX_DATA.length;
    DOM.filteredCount.textContent = POLYDEX_DATA.length;

    // Create particles
    createParticles();

    // Create grid cards
    createGridCards();

    // Initial display
    updateActiveDisplay(0, false);

    // Start animation loop
    startShapeAnimation();

    // Search handler
    DOM.searchInput.addEventListener('input', handleSearch);

    // Keyboard shortcuts
    setupKeyboard();

    // Log readiness
    console.log('%c✦ POLYDEX v2.0 — Geometric Encyclopedia Initialized ✦', 
        'color: #00f0ff; font-family: monospace; font-size: 14px; padding: 8px;');
    console.log(`%c  ${POLYDEX_DATA.length} shapes loaded`, 
        'color: #8a9cc0; font-family: monospace;');
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', init);
