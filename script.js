/* ============================================================
   MERGE & SNAP - script.js
   Partie 1 : Variables globales, Menus, Sauvegarde, Énergie
   ============================================================ */

'use strict';

// ============================================================
// 1. VARIABLES GLOBALES DE L'ÉTAT DU JEU
// ============================================================

const gridElement = document.getElementById('grid');
const cols        = 7;
const rows        = 9;
const gridSize    = cols * rows;

/** Item en cours de drag (desktop) */
let draggedItem = null;
/** Cellule source du drag */
let sourceCell  = null;

/** Slot de sauvegarde actif (1, 2 ou 3) */
let currentSlot = 1;

/** Données du personnage courant */
let currentCharacter = { gender: 'homme', hair: 1, top: 1, bottom: 1 };
let selectedGender   = null;

// --- Stats du joueur ---
let playerName        = 'Photographe';
let playerGender      = 'homme';
let currentLevel      = 1;
let energy            = 100;
let coins             = 0;
let gems              = 0;
let currentMissionIndex = 0;

// --- Énergie ---
const MAX_ENERGY        = 100;
const ENERGY_REGEN_TIME = 90000; // 1 min 30 s en ms
let lastEnergyTime      = Date.now();

// --- Inventaire ---
let isInventoryOpen  = false;
const inventoryCols  = 8;
const inventoryRows  = 20;
const inventorySize  = inventoryCols * inventoryRows;


// ============================================================
// 2. DONNÉES DES NIVEAUX (Missions & Mentors)
// ============================================================

const levelsData = {
    1: {
        mentor: 'Prof. Alistair',
        avatar: '👨‍🦳',
        missions: [
            { text: 'Appareil (Niv 3)', req: { family: 'A', level: 3 }, reward: 100 },
            { text: 'Objectif (Niv 3)', req: { family: 'B', level: 3 }, reward: 150 },
            { text: 'Appareil (Niv 4)', req: { family: 'A', level: 4 }, reward: 200 }
        ]
    },
    2: {
        mentor: 'Prof. Elena',
        avatar: '👩‍🏫',
        missions: [
            { text: 'Objectif (Niv 5)',  req: { family: 'B', level: 5 }, reward: 300 },
            { text: 'Pellicule (Niv 5)', req: { family: 'C', level: 5 }, reward: 300 },
            { text: 'Téléphone (Niv 5)', req: { family: 'D', level: 5 }, reward: 400 }
        ]
    },
    3: {
        mentor: 'Prof. Dupont',
        avatar: '👨‍🎨',
        missions: [
            { text: 'Objectif (Niv 6)',  req: { family: 'B', level: 6 }, reward: 500 },
            { text: 'Pellicule (Niv 6)', req: { family: 'C', level: 6 }, reward: 500 },
            { text: 'Téléphone (Niv 7)', req: { family: 'D', level: 7 }, reward: 600 }
        ]
    },
    4: {
        mentor: 'Directrice',
        avatar: '👩‍💼',
        missions: [
            { text: 'Appareil (Niv 8)',  req: { family: 'A', level: 8 }, reward: 800 },
            { text: 'Objectif (Niv 8)',  req: { family: 'B', level: 8 }, reward: 800 },
            { text: 'Pellicule (Niv 8)', req: { family: 'C', level: 8 }, reward: 900 }
        ]
    },
    5: {
        mentor: 'Examen Final',
        avatar: '🎓',
        missions: [
            { text: 'Téléphone (Niv 9)',  req: { family: 'D', level: 9  }, reward: 1200 },
            { text: 'Appareil (Niv 10)',  req: { family: 'A', level: 10 }, reward: 1500 },
            { text: 'Objectif (Niv 10)', req: { family: 'B', level: 10 }, reward: 2000 }
        ]
    }
};

// Noms lisibles des familles d'objets
const itemNames = {
    'A': ['Appareil Lvl 1','Appareil Lvl 2','Appareil Lvl 3','Appareil Lvl 4','Appareil Lvl 5',
          'Appareil Lvl 6','Appareil Lvl 7','Appareil Lvl 8','Appareil Lvl 9','Appareil Lvl 10'],
    'B': ['Objectif Lvl 1','Objectif Lvl 2','Objectif Lvl 3','Objectif Lvl 4','Objectif Lvl 5',
          'Objectif Lvl 6','Objectif Lvl 7','Objectif Lvl 8','Objectif Lvl 9','Objectif Lvl 10'],
    'C': ['Pellicule Lvl 1','Pellicule Lvl 2','Pellicule Lvl 3','Pellicule Lvl 4','Pellicule Lvl 5',
          'Pellicule Lvl 6','Pellicule Lvl 7','Pellicule Lvl 8','Pellicule Lvl 9','Pellicule Lvl 10'],
    'D': ['Téléphone Lvl 1','Téléphone Lvl 2','Téléphone Lvl 3','Téléphone Lvl 4','Téléphone Lvl 5',
          'Téléphone Lvl 6','Téléphone Lvl 7','Téléphone Lvl 8','Téléphone Lvl 9','Téléphone Lvl 10']
};


// ============================================================
// 3. SYSTÈME DE SAUVEGARDE (LocalStorage)
// ============================================================

/**
 * Sauvegarde l'état complet du jeu dans le slot actif.
 */
function saveGame() {
    const cells     = document.querySelectorAll('.cell');
    const gridCells = [];
    const fogStates = [];

    cells.forEach((cell, index) => {
        // État du brouillard
        fogStates.push(cell.dataset.fogState || 'clear');

        // Contenu de la cellule
        if (cell.firstChild) {
            gridCells.push({
                index   : index,
                family  : cell.firstChild.dataset.family,
                level   : cell.firstChild.dataset.level,
                isLocked: cell.firstChild.dataset.locked === 'true'
            });
        }
    });

    const state = {
        name           : playerName,
        gender         : playerGender,
        level          : currentLevel,
        energy         : energy,
        coins          : coins,
        gems           : gems,
        mission        : currentMissionIndex,
        grid           : gridCells,
        fogStates      : fogStates,
        lastEnergyTime : lastEnergyTime
    };

    localStorage.setItem(`save_slot_${currentSlot}`, JSON.stringify(state));
}

/**
 * Charge la sauvegarde du slot actif et reconstruit la grille.
 */
function loadGame() {
    const saved = localStorage.getItem(`save_slot_${currentSlot}`);
    if (!saved) return;

    const state = JSON.parse(saved);

    playerName          = state.name   || 'Photographe';
    playerGender        = state.gender || 'homme';
    currentLevel        = state.level  || 1;
    energy              = state.energy !== undefined ? state.energy : 100;
    coins               = state.coins  || 0;
    gems                = state.gems   || 0;
    currentMissionIndex = state.mission || 0;

    // --- Régénération d'énergie hors-ligne ---
    const savedLastEnergyTime = state.lastEnergyTime || Date.now();
    if (energy < MAX_ENERGY) {
        const elapsedOffline = Date.now() - savedLastEnergyTime;
        const gainedEnergy   = Math.floor(elapsedOffline / ENERGY_REGEN_TIME);
        if (gainedEnergy > 0) {
            energy += gainedEnergy;
            if (energy >= MAX_ENERGY) {
                energy = MAX_ENERGY;
                lastEnergyTime = Date.now();
            } else {
                lastEnergyTime = Date.now() - (elapsedOffline % ENERGY_REGEN_TIME);
            }
        } else {
            lastEnergyTime = savedLastEnergyTime;
        }
    } else {
        lastEnergyTime = Date.now();
    }

    // Plafonnement du niveau
    if (currentLevel > 5) {
        currentLevel        = 5;
        currentMissionIndex = 2;
    }

    // --- Reconstruction de la grille ---
    if (state.grid) {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            cell.innerHTML = '';
            cell.classList.remove('fog-solid', 'fog-burned');

            const fogState = (state.fogStates && state.fogStates[index]) ? state.fogStates[index] : 'clear';
            cell.dataset.fogState = fogState;

            if (fogState === 'solid')  cell.classList.add('fog-solid');
            if (fogState === 'burned') cell.classList.add('fog-burned');
        });

        state.grid.forEach(itemData => {
            const targetCell = cells[itemData.index];
            if (!targetCell) return;

            // Support des anciens formats de sauvegarde
            const isLocked = itemData.isLocked === true || itemData.locked === true;
            targetCell.appendChild(createItemElement(itemData.family, parseInt(itemData.level), isLocked));
        });
    }

    updateUI();
}


// ============================================================
// 4. MENUS & NAVIGATION
// ============================================================

/**
 * Affiche un message "Prochainement" pour les boutons secondaires
 * du menu principal.
 */
function showComingSoon(name) {
    alert(`${name} — Prochainement ! 🚀`);
}

/**
 * Passe du menu principal à l'écran de sélection de sauvegarde.
 */
function goToSaveMenu() {
    document.getElementById('main-menu').style.display = 'none';
    renderMainMenu();
}

/**
 * Affiche l'écran de sélection de slot de sauvegarde (casier).
 */
function renderMainMenu() {
    const gameUi = document.getElementById('game-ui');
    gameUi.classList.remove('game-visible');
    gameUi.style.display = '';
    document.getElementById('character-creator').style.display = 'none';
    document.getElementById('start-menu').style.display     = 'flex';
    document.getElementById('main-menu').style.display      = 'none';

    const container = document.getElementById('save-slots-container');
    container.innerHTML = '';

    for (let i = 1; i <= 3; i++) {
        const saved   = localStorage.getItem(`save_slot_${i}`);
        const slotDiv = document.createElement('div');
        slotDiv.className = 'save-slot';

        if (saved) {
            const data = JSON.parse(saved);
            slotDiv.innerHTML = `
                <p class="save-name">${data.name || 'Inconnu'}</p>
                <div class="save-actions">
                    <button class="save-slot-btn btn-play"   onclick="playSlot(${i})">Jouer</button>
                    <button class="save-slot-btn btn-delete" onclick="deleteSlot(${i})">🗑️</button>
                </div>`;
        } else {
            slotDiv.innerHTML = `
                <div class="save-slot-title">Slot ${i}</div>
                <button class="save-slot-btn btn-new-game" onclick="newGameSlot(${i})">Nouvelle<br>Partie</button>`;
        }

        container.appendChild(slotDiv);
    }
}

/**
 * Retour au menu principal (BOGUE 3) depuis l'écran de jeu.
 * Sauvegarde d'abord, puis affiche le menu principal.
 */
function backToMainMenu() {
    saveGame();
    const gameUi = document.getElementById('game-ui');
    gameUi.classList.remove('game-visible');
    gameUi.style.display = '';
    document.getElementById('start-menu').style.display = 'none';
    const mainMenu = document.getElementById('main-menu');
    if (mainMenu) mainMenu.style.display = 'flex';
}

/**
 * Lance une partie existante depuis un slot.
 */
function playSlot(slot) {
    currentSlot = slot;
    document.getElementById('start-menu').style.display = 'none';
    const gameUi = document.getElementById('game-ui');
    gameUi.classList.add('game-visible');
    startGame();
}

/**
 * Supprime un slot de sauvegarde après confirmation.
 */
function deleteSlot(slot) {
    if (confirm('Voulez-vous vraiment effacer cette sauvegarde ?')) {
        localStorage.removeItem(`save_slot_${slot}`);
        renderMainMenu();
    }
}

/**
 * Lance la création de personnage pour un nouveau slot.
 */
function newGameSlot(slot) {
    currentSlot = slot;
    document.getElementById('start-menu').style.display          = 'none';
    document.getElementById('character-creator').style.display   = 'flex';
}

/**
 * Retour au menu casier depuis la création de personnage.
 */
function backToMenu() {
    document.getElementById('character-creator').style.display = 'none';
    renderMainMenu();
}

/**
 * Sélectionne le genre dans l'écran de création.
 */
function selectGender(gender, btnElement) {
    selectedGender        = gender;
    currentCharacter.gender = gender;

    const bodyLayer = document.getElementById('body-layer');
    bodyLayer.src = gender === 'femme'
        ? 'assets/decor_perso/femme_dressing.png'
        : 'assets/decor_perso/homme_1_dressing.png';

    document.querySelectorAll('.gender-btn').forEach(btn => btn.classList.remove('selected'));
    btnElement.classList.add('selected');
}

/**
 * Valide la création du personnage et lance une nouvelle partie.
 */
function validateCreation() {
    const nameInput = document.getElementById('player-name-input').value.trim();
    if (!nameInput) { alert('Veuillez entrer un nom.'); return; }
    if (!selectedGender) { alert('Veuillez choisir un genre.'); return; }

    playerName   = nameInput;
    playerGender = selectedGender;

    // Réinitialisation pour nouvelle partie
    currentLevel        = 1;
    energy              = 100;
    coins               = 0;
    gems                = 0;
    currentMissionIndex = 0;

    document.getElementById('character-creator').style.display = 'none';
    const gameUi = document.getElementById('game-ui');
    gameUi.classList.add('game-visible');

    startGame();
}

/**
 * Point d'entrée commun pour lancer/reprendre une partie.
 */
function startGame() {
    document.getElementById('ui-level').innerHTML =
        `LVL ${currentLevel} <br><span style="font-size:10px;">${playerName}</span>`;
    initGrid();
}


// ============================================================
// 5. SYSTÈME D'ÉNERGIE (Régénération en temps réel)
// ============================================================

/**
 * Met à jour le timer d'énergie affiché dans le HUD.
 * Appelée toutes les secondes via setInterval.
 */
function updateEnergyTimer() {
    const timerEl = document.getElementById('ui-energy-timer');
    if (!timerEl) return;

    if (energy >= MAX_ENERGY) {
        lastEnergyTime = Date.now();
        timerEl.textContent = 'MAX';
        return;
    }

    let elapsed = Date.now() - lastEnergyTime;

    if (elapsed >= ENERGY_REGEN_TIME) {
        energy++;
        lastEnergyTime += ENERGY_REGEN_TIME; // avance d'exactement un cycle

        const energyEl = document.getElementById('ui-energy');
        if (energyEl) energyEl.textContent = energy;

        const fillEl = document.getElementById('ui-energy-fill');
        if (fillEl) fillEl.style.width = Math.min(100, (energy / MAX_ENERGY) * 100) + '%';

        saveGame();

        if (energy >= MAX_ENERGY) {
            timerEl.textContent = 'MAX';
            return;
        }
        elapsed = Date.now() - lastEnergyTime;
    }

    const remaining    = ENERGY_REGEN_TIME - elapsed;
    const totalSeconds = Math.floor(remaining / 1000);
    const minutes      = Math.floor(totalSeconds / 60);
    const seconds      = totalSeconds % 60;
    timerEl.textContent = `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
}

// Démarrage du timer d'énergie (toutes les secondes)
setInterval(updateEnergyTimer, 1000);


// ============================================================
// 6. INVENTAIRE
// ============================================================

/** Achète 8 cases d'inventaire supplémentaires (100 💎). */
window.buyInventorySlots = function () {
    if (gems >= 100) {
        gems -= 100;
        document.getElementById('ui-gems').textContent = gems;

        const invGrid     = document.getElementById('inventory-grid');
        const currentCount = document.querySelectorAll('.inventory-slot').length;
        for (let i = 0; i < 8; i++) {
            const slot = document.createElement('div');
            slot.className    = 'inventory-slot';
            slot.dataset.index = currentCount + i;
            invGrid.appendChild(slot);
        }
        showMessage("+8 cases d'inventaire !");
    } else {
        showMessage('Pas assez de diamants !');
    }
};

/** Initialise les slots de l'inventaire. */
function initInventory() {
    const invGrid = document.getElementById('inventory-grid');
    for (let i = 0; i < inventorySize; i++) {
        const slot = document.createElement('div');
        slot.className    = 'inventory-slot';
        slot.dataset.index = i;
        invGrid.appendChild(slot);
    }
}

window.openInventory = function () {
    const modal = document.getElementById('inventory-modal');
    if (modal) { modal.style.display = 'flex'; isInventoryOpen = true; }
};

window.closeInventory = function () {
    const modal = document.getElementById('inventory-modal');
    if (modal) { modal.style.display = 'none'; isInventoryOpen = false; }
};

/**
 * Gère le clic sur un item lorsque l'inventaire est ouvert :
 * déplace l'item entre la grille principale et l'inventaire.
 */
function handleItemClick(e) {
    if (!isInventoryOpen) return;

    const item   = e.currentTarget;
    if (item.dataset.locked === 'true') { showMessage('Cet objet est verrouillé !'); return; }

    const parent = item.parentElement;

    if (parent.classList.contains('cell')) {
        // → vers l'inventaire
        const emptySlots = Array.from(document.querySelectorAll('.inventory-slot')).filter(s => !s.hasChildNodes());
        if (emptySlots.length > 0) {
            emptySlots[0].appendChild(item);
        } else {
            showMessage('Inventaire plein !');
        }
    } else if (parent.classList.contains('inventory-slot')) {
        // → vers la grille principale
        const emptyCells = Array.from(document.querySelectorAll('.cell')).filter(c => !c.hasChildNodes());
        if (emptyCells.length > 0) {
            emptyCells[0].appendChild(item);
        } else {
            showMessage('Grille principale pleine !');
        }
    }
    saveGame();
}

// Drag & drop depuis l'inventaire vers le bouton "Stock"
function setupInventoryBtnDrop() {
    const invBtn = document.getElementById('inventory-btn');
    if (!invBtn) return;

    invBtn.addEventListener('dragover',  e => { e.preventDefault(); invBtn.style.transform = 'scale(1.1)'; });
    invBtn.addEventListener('dragleave', () => { invBtn.style.transform = ''; });
    invBtn.addEventListener('drop', e => {
        e.preventDefault();
        invBtn.style.transform = '';
        if (draggedItem && draggedItem.parentElement.classList.contains('cell')) {
            const emptySlots = Array.from(document.querySelectorAll('.inventory-slot')).filter(s => !s.hasChildNodes());
            if (emptySlots.length > 0) {
                emptySlots[0].appendChild(draggedItem);
            } else {
                showMessage('Inventaire plein !');
            }
        }
    });
}


// ============================================================
// 7. MESSAGES FLOTTANTS (Toast)
// ============================================================

/**
 * Affiche un message temporaire au centre de l'écran.
 * @param {string} msg - Texte à afficher
 */
function showMessage(msg) {
    const msgEl = document.getElementById('message');
    if (!msgEl) return;
    msgEl.textContent = msg;
    msgEl.style.opacity = '1';
    setTimeout(() => { msgEl.style.opacity = '0'; }, 1500);
}


// ============================================================
// PARTIE 2 : Grille, Items, Brouillard animé, Drag & Drop
// ============================================================


// ============================================================
// 8. INITIALISATION DE LA GRILLE
// ============================================================

/**
 * Crée les cellules de la grille, charge la sauvegarde,
 * et place les objets initiaux si la grille est vide.
 */
function initGrid() {
    gridElement.innerHTML = ''; // On vide avant de reconstruire

    for (let i = 0; i < gridSize; i++) {
        const cell = document.createElement('div');
        cell.className    = 'cell';
        cell.dataset.index = i;

        // Événements drag desktop
        cell.addEventListener('dragover',  handleDragOver);
        cell.addEventListener('dragenter', handleDragEnter);
        cell.addEventListener('dragleave', handleDragLeave);
        cell.addEventListener('drop',      handleDrop);

        gridElement.appendChild(cell);
    }

    loadGame(); // Charge la sauvegarde (si elle existe)

    // Si la grille est encore vide après le chargement → nouvelle partie
    const cells    = document.querySelectorAll('.cell');
    const hasItems = Array.from(cells).some(c => c.hasChildNodes());

    if (!hasItems) {
        _initNewGameGrid(cells);
    } else {
        // S'assurer que le générateur est toujours présent
        _ensureGenerator(cells);
    }
}

/**
 * Place le brouillard initial et les objets de départ
 * pour une toute nouvelle partie.
 * @param {NodeList} cells
 */
function _initNewGameGrid(cells) {
    // Cases libres dès le départ (autour du générateur)
    const freeIndices   = [2, 3, 4, 9, 10, 11, 16, 17, 18];
    // Cases "papier brûlé" (visibles mais verrouillées)
    const burnedIndices = [1, 5, 8, 12, 15, 19, 23, 24, 25];
    // Objets spéciaux
    const papierIndices = [8, 12, 24];
    const coffreIndices = [19, 21, 25];
    const sortieIndex   = 62; // Dernière case en bas à droite

    for (let i = 0; i < gridSize; i++) {
        const cell = cells[i];

        if (freeIndices.includes(i)) {
            cell.dataset.fogState = 'clear';

        } else if (burnedIndices.includes(i)) {
            cell.dataset.fogState = 'burned';
            cell.classList.add('fog-burned');

            if (papierIndices.includes(i)) {
                cell.appendChild(createItemElement('PAPIER',  1, true));
            } else if (coffreIndices.includes(i)) {
                cell.appendChild(createItemElement('COFFRE',  1, true));
            } else {
                const lvl = Math.floor(Math.random() * 4) + 1;
                cell.appendChild(createItemElement('A', lvl, true));
            }

        } else {
            // Case solide (vieux papier — totalement cachée)
            cell.dataset.fogState = 'solid';
            cell.classList.add('fog-solid');

            if (i === sortieIndex) {
                cell.appendChild(createItemElement('SORTIE', 1, true));
            } else if (papierIndices.includes(i)) {
                cell.appendChild(createItemElement('PAPIER', 1, true));
            } else if (coffreIndices.includes(i)) {
                cell.appendChild(createItemElement('COFFRE', 1, true));
            } else {
                const lvl = Math.floor(Math.random() * 4) + 1;
                cell.appendChild(createItemElement('A', lvl, true));
            }
        }
    }

    // Placement du générateur (index 3, case centrale du haut)
    const generatorCell = document.querySelector('.cell[data-index="3"]');
    if (generatorCell) generatorCell.appendChild(createItemElement('GENERATOR', 1));

    saveGame();
}

/**
 * Vérifie que le générateur est toujours sur la grille.
 * S'il manque, on le recrée à l'index 3.
 * @param {NodeList} cells
 */
function _ensureGenerator(cells) {
    const generatorCell = document.querySelector('.cell[data-index="3"]');
    if (!generatorCell) return;
    if (generatorCell.querySelector('[data-family="GENERATOR"]')) return;

    // Déplacer l'item existant si nécessaire
    if (generatorCell.firstChild) {
        const emptyCells = Array.from(cells).filter(c => !c.hasChildNodes());
        if (emptyCells.length > 0) {
            emptyCells[0].appendChild(generatorCell.firstChild);
        }
    }
    generatorCell.appendChild(createItemElement('GENERATOR', 1));
}


// ============================================================
// 9. CRÉATION D'UN ÉLÉMENT ITEM
// ============================================================

/**
 * Crée et retourne un élément DOM représentant un objet du jeu.
 * @param {string}  family   - Famille de l'item ('A','B','C','D','GENERATOR','PAPIER','COFFRE','SORTIE')
 * @param {number}  level    - Niveau de l'item (1–10)
 * @param {boolean} isLocked - Si vrai, l'item ne peut pas être déplacé
 * @returns {HTMLElement}
 */
function createItemElement(family, level, isLocked = false) {
    const item = document.createElement('div');
    item.className        = 'item';
    item.dataset.family   = family;
    item.dataset.level    = level;
    item.dataset.locked   = isLocked ? 'true' : 'false';

    const contentDiv = document.createElement('div');

    // --- CAS 1 : Générateur ---
    if (family === 'GENERATOR') {
        item.draggable      = false;
        item.dataset.locked = 'true';
        contentDiv.innerHTML = '<span style="font-size:clamp(2rem,8cqw,3rem);">📦</span>';
        item.addEventListener('click', handleGeneratorClick);

    // --- CAS 2 : Objets spéciaux (Papier, Coffre, Sortie) ---
    } else if (family === 'PAPIER' || family === 'COFFRE' || family === 'SORTIE') {
        item.draggable      = false;
        item.dataset.locked = 'true';

        const emojis = { PAPIER: '📄', COFFRE: '🧰', SORTIE: '🚪' };
        contentDiv.innerHTML = `<span style="font-size:clamp(2rem,8cqw,3rem);">${emojis[family]}</span>`;

        item.addEventListener('click', handleSpecialItemClick);

    // --- CAS 3 : Items fusionnables (familles A, B, C, D) ---
    } else {
        item.draggable = !isLocked;

        // Forcer le fond transparent sur le conteneur
        _setTransparent(contentDiv);
        _setTransparent(item);

        // Image de l'item selon sa famille
        const imgSrc = _getItemImageSrc(family, level);
        if (imgSrc) {
            const img = document.createElement('img');
            img.src = imgSrc;
            _setTransparent(img);
            contentDiv.appendChild(img);
        } else {
            // Fallback texte si pas d'image
            const span = document.createElement('span');
            span.className = 'item-text';
            const name = (itemNames[family] && itemNames[family][level - 1])
                ? itemNames[family][level - 1]
                : `${family} Lvl ${level}`;
            span.innerHTML = `<span style="font-size:clamp(2rem,8cqw,3rem);">${name.split(' ')[0]}</span>`;
            contentDiv.appendChild(span);
        }

        // Événements drag & touch (seulement si non verrouillé)
        if (!isLocked) {
            item.addEventListener('dragstart',   handleDragStart);
            item.addEventListener('touchstart',  handleTouchStart, { passive: false });
            item.addEventListener('touchmove',   handleTouchMove,  { passive: false });
            item.addEventListener('touchend',    handleTouchEnd);
            item.addEventListener('touchcancel', handleTouchEnd);
        }
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('click',   handleItemClick);
    }

    item.appendChild(contentDiv);

    // BOGUE 2 FIX : Désactiver le drag sur TOUS les enfants (images, spans)
    // pour éviter qu'ils interceptent l'événement et cassent le drag&drop
    item.querySelectorAll('img, span, div').forEach(child => {
        child.setAttribute('draggable', 'false');
        child.style.pointerEvents = 'none';
    });

    return item;
}

/**
 * Retourne le chemin de l'image d'un item selon sa famille et son niveau.
 * @param {string} family
 * @param {number} level
 * @returns {string|null}
 */
function _getItemImageSrc(family, level) {
    const map = {
        'A': `assets/Famille_A/appareil_lvl${level}.png?v=2`,
        'B': `assets/Famille_B/objectif_lvl${level}.png`,
        'C': `assets/Famille_C/pellicule_lvl${level}.png`,
        'D': `assets/Famille_D/telephone_lvl${level}.png`
    };
    return map[family] || null;
}

/**
 * Applique les styles "fond transparent" sur un élément DOM.
 * Nécessaire pour éviter les fonds blancs parasites sur les items.
 * @param {HTMLElement} el
 */
function _setTransparent(el) {
    el.style.setProperty('background',       'transparent', 'important');
    el.style.setProperty('background-color', 'transparent', 'important');
    el.style.setProperty('background-image', 'none',        'important');
    el.style.setProperty('border',           'none',        'important');
    el.style.setProperty('box-shadow',       'none',        'important');
    if (el.tagName !== 'IMG') {
        el.style.width           = '100%';
        el.style.height          = '100%';
        el.style.display         = 'flex';
        el.style.justifyContent  = 'center';
        el.style.alignItems      = 'center';
        el.style.pointerEvents   = 'none';
    }
}


// ============================================================
// 10. OBJETS SPÉCIAUX (Papier, Coffre, Sortie)
// ============================================================

/**
 * Gère le clic sur un objet spécial (Papier, Coffre, Sortie).
 * Vérifie que la cellule est "clear" avant d'agir.
 */
function handleSpecialItemClick() {
    const cell = this.parentElement;
    if (cell.dataset.fogState !== 'clear') return;

    const family = this.dataset.family;

    if (family === 'PAPIER') {
        _handlePapierClick(this, cell);
    } else if (family === 'COFFRE') {
        _handleCoffreClick(this, cell);
    } else if (family === 'SORTIE') {
        _handleSortieClick(this, cell);
    }
}

/** Papier bonus : +15 énergie */
function _handlePapierClick(item, cell) {
    energy += 15;
    if (energy > MAX_ENERGY) energy = MAX_ENERGY;
    document.getElementById('ui-energy').textContent = energy;
    showMessage('+15 Énergie !');
    cell.removeChild(item);
    cell.dataset.unlocked = 'true';
    saveGame();
}

/** Coffre : dépose 1 à 3 items aléatoires dans les cases adjacentes */
function _handleCoffreClick(item, cell) {
    const cellIndex = parseInt(cell.dataset.index);
    const adjacentIndices = [
        cellIndex - cols,                                                // Haut
        cellIndex + cols,                                                // Bas
        (cellIndex % cols !== 0)          ? cellIndex - 1 : -1,         // Gauche
        (cellIndex % cols !== cols - 1)   ? cellIndex + 1 : -1          // Droite
    ].filter(idx => idx >= 0 && idx < gridSize);

    const allCells      = document.querySelectorAll('.cell');
    let emptyAdjacents  = adjacentIndices
        .map(idx => allCells[idx])
        .filter(c => c && !c.hasChildNodes());

    const numDrops = Math.floor(Math.random() * 3) + 1; // 1 à 3 items
    let spawned    = 0;

    for (let i = 0; i < numDrops; i++) {
        const f = ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
        const l = Math.floor(Math.random() * 2) + 1;

        if (emptyAdjacents.length > 0) {
            emptyAdjacents.pop().appendChild(createItemElement(f, l, false));
            spawned++;
        } else if (spawnSpecificItem(f, l, false)) {
            spawned++;
        }
    }

    if (spawned > 0) {
        showMessage('Coffre ouvert !');
        cell.removeChild(item);
        cell.dataset.unlocked = 'true';
        saveGame();
    } else {
        showMessage('Plus de place pour le coffre !');
    }
}

/** Sortie : victoire si toutes les missions sont terminées */
function _handleSortieClick(item, cell) {
    if (currentLevel >= 5 && currentMissionIndex >= 2) {
        showMessage('Vous avez ouvert la Sortie ! Victoire ! 🎉');
        cell.removeChild(item);
        cell.dataset.unlocked = 'true';
        saveGame();
    } else {
        showMessage("Finissez toutes les missions d'abord !");
    }
}


// ============================================================
// 11. SYSTÈME DE BROUILLARD (Fog of War)
// ============================================================

/**
 * Propage le brouillard : toute case "solid" adjacente à une
 * case "clear" passe en "burned" (papier brûlé visible).
 */
function updateFog() {
    const cells     = document.querySelectorAll('.cell');
    let fogChanged  = false;

    for (let i = 0; i < cells.length; i++) {
        if (cells[i].dataset.fogState !== 'solid') continue;

        const neighbors = _getNeighborIndices(i);
        const hasClearNeighbor = neighbors.some(n => cells[n].dataset.fogState === 'clear');

        if (hasClearNeighbor && cells[i].dataset.unlocked !== 'true') {
            cells[i].dataset.fogState = 'burned';
            cells[i].classList.remove('fog-solid');
            cells[i].classList.add('fog-burned');
            fogChanged = true;
        }
    }

    if (fogChanged) saveGame();
}

/**
 * Animation de déverrouillage d'une cellule : le papier brûlé
 * s'enflamme et disparaît avant de révéler la case.
 * @param {HTMLElement} cell - La cellule à déverrouiller
 * @param {Function}    [callback] - Appelée une fois l'animation terminée
 */
function animateBurnReveal(cell, callback) {
    cell.classList.add('fog-burning'); // Déclenche l'animation CSS

    setTimeout(() => {
        cell.classList.remove('fog-burned', 'fog-burning');
        cell.dataset.fogState = 'clear';
        cell.dataset.unlocked = 'true';
        if (callback) callback();
        updateFog();
        saveGame();
    }, 700); // Durée de l'animation (doit correspondre à @keyframes burnReveal dans style.css)
}

/**
 * Retourne les indices des voisins (haut, bas, gauche, droite)
 * d'une cellule, en respectant les bords de la grille.
 * @param {number} i - Index de la cellule
 * @returns {number[]}
 */
function _getNeighborIndices(i) {
    const neighbors = [];
    if (i >= cols)              neighbors.push(i - cols); // Haut
    if (i < gridSize - cols)    neighbors.push(i + cols); // Bas
    if (i % cols !== 0)         neighbors.push(i - 1);    // Gauche
    if (i % cols !== cols - 1)  neighbors.push(i + 1);    // Droite
    return neighbors;
}


// ============================================================
// 12. SPAWN D'ITEMS
// ============================================================

/**
 * Fait apparaître un item dans la première case vide disponible.
 * @param {string}  family
 * @param {number}  level
 * @param {boolean} isLocked
 * @returns {boolean} - true si le spawn a réussi
 */
function spawnSpecificItem(family, level, isLocked = false) {
    const cells      = document.querySelectorAll('.cell');
    const emptyCells = Array.from(cells).filter(c => !c.hasChildNodes());

    if (emptyCells.length > 0) {
        const target = (family !== 'A' || isLocked)
            ? emptyCells[Math.floor(Math.random() * emptyCells.length)]
            : emptyCells[0];
        target.appendChild(createItemElement(family, level, isLocked));
        checkMissionStatus();
        return true;
    }

    showMessage('Grille principale pleine !');
    return false;
}


// ============================================================
// 13. DRAG & DROP — DESKTOP
// BOGUE 2 FIX : On utilise dataTransfer pour transporter l'index
// de la cellule source. C'est plus robuste que la variable globale
// seule, surtout quand les événements se chevauchent.
// ============================================================

function handleDragStart(e) {
    if (this.dataset.locked === 'true') { e.preventDefault(); return; }

    draggedItem = this;
    sourceCell  = this.parentElement;

    // Stocker l'index de la cellule source dans dataTransfer (robustesse)
    if (sourceCell && sourceCell.dataset.index !== undefined) {
        e.dataTransfer.setData('text/plain', sourceCell.dataset.index);
    }
    e.dataTransfer.effectAllowed = 'move';

    setTimeout(() => {
        this.style.opacity = '0.5';
        this.style.zIndex  = '100';
    }, 0);
}

function handleDragEnd() {
    // Remettre l'opacité même si le drop n'a pas eu lieu
    if (draggedItem) {
        draggedItem.style.opacity = '1';
        draggedItem.style.zIndex  = '';
    }
    draggedItem = null;
    sourceCell  = null;
}

function handleDragOver(e)  {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    e.preventDefault();
    if (this !== sourceCell) {
        this.style.background = 'rgba(232,220,200,0.5)';
        this.style.boxShadow  = 'inset 0 0 10px rgba(0,0,0,0.15)';
    }
}

function handleDragLeave(e) {
    // Éviter le flicker quand on survole un enfant de la cellule
    if (!this.contains(e.relatedTarget)) {
        this.style.background = '';
        this.style.boxShadow  = '';
    }
}

function handleDrop(e) {
    e.preventDefault();
    this.style.background = '';
    this.style.boxShadow  = '';

    // Récupérer l'item dragué — si la variable globale est perdue,
    // on retrouve la cellule source via dataTransfer
    if (!draggedItem) {
        const srcIndex = e.dataTransfer.getData('text/plain');
        if (srcIndex !== '') {
            const srcCell = document.querySelector(`.cell[data-index="${srcIndex}"]`);
            if (srcCell && srcCell.firstChild) {
                draggedItem = srcCell.firstChild;
                sourceCell  = srcCell;
            }
        }
    }

    if (!draggedItem) return;
    processDropLogic(draggedItem, sourceCell, this);
    draggedItem = null;
    sourceCell  = null;
}


// ============================================================
// 14. TOUCH EVENTS — MOBILE
// ============================================================

function handleTouchStart(e) {
    if (this.dataset.locked === 'true') return;
    e.preventDefault();

    draggedItem = this;
    sourceCell  = this.parentElement;

    const rect  = this.getBoundingClientRect();
    const touch = e.touches[0];

    // Positionner l'item librement sur le body pour le drag visuel
    this.style.position      = 'absolute';
    this.style.zIndex         = '1000';
    this.style.pointerEvents  = 'none';
    this.style.width          = rect.width  + 'px';
    this.style.height         = rect.height + 'px';
    this.style.left           = (touch.clientX - rect.width  / 2) + 'px';
    this.style.top            = (touch.clientY - rect.height / 2) + 'px';
    this.style.opacity        = '0.7';

    document.body.appendChild(this);
}

function handleTouchMove(e) {
    if (!draggedItem) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect  = draggedItem.getBoundingClientRect();
    draggedItem.style.left = (touch.clientX - rect.width  / 2) + 'px';
    draggedItem.style.top  = (touch.clientY - rect.height / 2) + 'px';
}

function handleTouchEnd(e) {
    if (!draggedItem) return;

    // Réinitialiser les styles de drag
    draggedItem.style.position     = '';
    draggedItem.style.zIndex       = '';
    draggedItem.style.pointerEvents = '';
    draggedItem.style.width        = '';
    draggedItem.style.height       = '';
    draggedItem.style.left         = '';
    draggedItem.style.top          = '';
    draggedItem.style.opacity      = '1';

    // Si l'item est resté sur le body, le remettre dans sa cellule source
    if (!draggedItem.parentElement || draggedItem.parentElement === document.body) {
        if (sourceCell) sourceCell.appendChild(draggedItem);
    }

    // Trouver la cellule cible sous le doigt
    const touch = e.changedTouches[0];
    let targetEl = document.elementFromPoint(touch.clientX, touch.clientY);

    // Remonter jusqu'à trouver une .cell
    while (targetEl && !targetEl.classList.contains('cell')) {
        targetEl = targetEl.parentElement;
        if (targetEl === document.body) { targetEl = null; break; }
    }

    if (targetEl && targetEl.classList.contains('cell')) {
        processDropLogic(draggedItem, sourceCell, targetEl);
    } else {
        sourceCell.appendChild(draggedItem); // Remettre à l'origine
    }

    draggedItem = null;
    sourceCell  = null;
}


// ============================================================
// 15. LOGIQUE DE FUSION (MERGE)
// ============================================================

/**
 * Traite le dépôt d'un item sur une cellule cible.
 * Fusionne deux items identiques ou échange leur position.
 * @param {HTMLElement} item       - L'item en cours de déplacement
 * @param {HTMLElement} fromCell   - La cellule d'origine
 * @param {HTMLElement} toCell     - La cellule de destination
 */
function processDropLogic(item, fromCell, toCell) {
    if (!item || toCell === fromCell) return;

    if (toCell.hasChildNodes()) {
        const targetItem   = toCell.firstChild;
        const dragFamily   = item.dataset.family;
        const targetFamily = targetItem.dataset.family;
        const dragLevel    = parseInt(item.dataset.level);
        const targetLevel  = parseInt(targetItem.dataset.level);

        // Interdire de déplacer le générateur
        if (targetFamily === 'GENERATOR' || dragFamily === 'GENERATOR') {
            showMessage('Impossible de déplacer cet objet !');
            fromCell.appendChild(item);
            return;
        }

        // --- FUSION : même famille, même niveau ---
        if (dragFamily === targetFamily && dragLevel === targetLevel) {
            if (dragLevel >= 10) {
                showMessage('Niveau maximum atteint !');
                // Échange simple si la cible n'est pas verrouillée
                if (targetItem.dataset.locked !== 'true') {
                    fromCell.appendChild(targetItem);
                    toCell.appendChild(item);
                } else {
                    fromCell.appendChild(item);
                }
                return;
            }

            // Retirer les deux items et créer le résultat fusionné
            toCell.removeChild(targetItem);
            fromCell.removeChild(item);
            const merged = createItemElement(dragFamily, dragLevel + 1, false);
            toCell.appendChild(merged);

            // Micro-animation de fusion
            merged.style.transform = 'scale(1.3)';
            setTimeout(() => { merged.style.transform = ''; }, 200);

            // Si la cellule cible était "burned", l'animer et la révéler
            if (toCell.dataset.fogState === 'burned') {
                animateBurnReveal(toCell, () => {
                    checkMissionStatus();
                    updateFog();
                });
            } else {
                checkMissionStatus();
                updateFog();
            }

        // --- ÉCHANGE : familles ou niveaux différents ---
        } else {
            if (targetItem.dataset.locked === 'true') {
                // Impossible d'échanger avec un item verrouillé
                fromCell.appendChild(item);
            } else {
                fromCell.appendChild(targetItem);
                toCell.appendChild(item);
            }
        }

    } else {
        // Cellule vide : simple déplacement
        toCell.appendChild(item);

        // Révéler si la cellule était "burned"
        if (toCell.dataset.fogState === 'burned') {
            animateBurnReveal(toCell);
        }
    }

    saveGame();
}


// ============================================================
// PARTIE 3 : UI, Missions, Générateur, Confettis, Initialisation
// ============================================================


// ============================================================
// 16. MISE À JOUR DE L'INTERFACE (HUD)
// ============================================================

/**
 * Met à jour tous les éléments visuels du HUD :
 * niveau, énergie, pièces, gemmes, fond de niveau,
 * et recharge l'affichage des missions.
 */
function updateUI() {
    // --- Fond d'écran selon le niveau ---
    document.body.className = `level-${currentLevel}`;

    // --- Niveau + Nom du joueur ---
    const levelEl = document.getElementById('ui-level');
    if (levelEl) {
        levelEl.innerHTML = `LVL ${currentLevel} <br><span style="font-size:10px;">${playerName}</span>`;
    }

    // --- Ressources ---
    const coinsEl  = document.getElementById('ui-coins');
    const energyEl = document.getElementById('ui-energy');
    const gemsEl   = document.getElementById('ui-gems');

    if (coinsEl)  coinsEl.textContent  = coins;
    if (energyEl) energyEl.textContent = energy;
    if (gemsEl)   gemsEl.textContent   = gems;

    // --- Barre XP (décorative, basée sur la progression des missions) ---
    const xpFillEl = document.getElementById('ui-xp-fill');
    if (xpFillEl) {
        // Calcule un % d'XP fictif basé sur la mission en cours
        const xpPercent = Math.round((currentMissionIndex / 3) * 100);
        xpFillEl.style.width = xpPercent + '%';
    }

    // --- Barre d'énergie (si présente) ---
    const fillEl = document.getElementById('ui-energy-fill');
    if (fillEl) {
        fillEl.style.width = Math.min(100, (energy / MAX_ENERGY) * 100) + '%';
    }

    // --- Zone de missions ---
    _renderMissions();
}

/**
 * Construit et affiche les cartes de mission dans #mission-area.
 * Affiche les 2 premières missions du niveau courant.
 */
function _renderMissions() {
    const levelData   = levelsData[currentLevel];
    const missionArea = document.getElementById('mission-area');
    if (!levelData || !missionArea) return;

    missionArea.innerHTML = '';

    // Avatars clients (busts) - utilisation des images _1 (buste)
    const avatarsBuste = [
        'assets/clients/femme_lunette2.png',
        'assets/clients/homme_prof_2.png'
    ];

    // On affiche les 2 premières missions du niveau
    const missionsToRender = levelData.missions.slice(0, 2);

    missionsToRender.forEach((mission, index) => {
        const card = document.createElement('div');
        card.className = 'mission-card';

        // État de la carte selon la progression
        if (index < currentMissionIndex) {
            card.classList.add('completed');
        } else if (index === currentMissionIndex) {
            card.classList.add('active');
            card.id = 'active-mission-card';
        }

        // --- Image du client (buste) ---
        const clientDiv = document.createElement('div');
        clientDiv.className = 'mission-card-client';
        const avatarImg = document.createElement('img');
        avatarImg.src = avatarsBuste[index % avatarsBuste.length];
        avatarImg.alt = `Client ${index + 1}`;
        clientDiv.appendChild(avatarImg);

        // --- Item requis (miniature) ---
        const reqDiv = document.createElement('div');
        reqDiv.className = 'mission-card-req';

        const reqImgSrc = _getItemImageSrc(mission.req.family, mission.req.level);
        if (reqImgSrc) {
            reqDiv.innerHTML = `<img src="${reqImgSrc.split('?')[0]}" alt="Objet requis">`;
        } else {
            // Fallback texte si pas d'image pour cet item
            const name = (itemNames[mission.req.family] && itemNames[mission.req.family][mission.req.level - 1])
                ? itemNames[mission.req.family][mission.req.level - 1]
                : `${mission.req.family}${mission.req.level}`;
            reqDiv.textContent = name.substring(0, 3);
        }

        // --- Récompense ---
        const rewardDiv = document.createElement('div');
        rewardDiv.className   = 'mission-card-reward';
        rewardDiv.textContent = `🪙 +${mission.reward}`;

        card.appendChild(clientDiv);
        card.appendChild(reqDiv);
        card.appendChild(rewardDiv);
        missionArea.appendChild(card);
    });

    // Vérifier si la mission active est validable
    checkMissionStatus();
}


// ============================================================
// 17. SYSTÈME DE MISSIONS
// ============================================================

/**
 * Vérifie si la mission active peut être validée :
 * l'item requis est-il présent sur la grille ?
 * Si oui, rend la carte cliquable avec animation pulse.
 */
function checkMissionStatus() {
    if (currentLevel > 5 || !levelsData[currentLevel]) return;

    const mission = levelsData[currentLevel].missions[currentMissionIndex];
    if (!mission) return;

    const req        = mission.req;
    const itemsOnGrid = document.querySelectorAll('.item');
    let   hasItem    = false;

    itemsOnGrid.forEach(item => {
        if (
            item.dataset.family === req.family &&
            parseInt(item.dataset.level) === req.level
        ) {
            hasItem = true;
        }
    });

    const activeCard = document.getElementById('active-mission-card');
    if (!activeCard) return;

    if (hasItem) {
        activeCard.classList.add('active-validable');
        activeCard.style.cursor = 'pointer';
        activeCard.onclick = () => validateMission(currentMissionIndex);
    } else {
        activeCard.classList.remove('active-validable');
        activeCard.style.cursor = '';
        activeCard.onclick = null;
    }
}

/**
 * Valide la mission active :
 * - Consomme l'item requis depuis la grille
 * - Attribue la récompense (pièces + énergie bonus)
 * - Avance la progression (mission → niveau)
 * @param {number} index - Index de la mission à valider
 */
function validateMission(index) {
    if (index !== currentMissionIndex) return;

    const mission = levelsData[currentLevel].missions[currentMissionIndex];
    if (!mission) return;

    // --- Trouver et consommer l'item requis ---
    const itemsOnGrid = document.querySelectorAll('.item');
    let   consumed    = false;

    itemsOnGrid.forEach(item => {
        if (
            !consumed &&
            item.dataset.family === mission.req.family &&
            parseInt(item.dataset.level) === mission.req.level
        ) {
            item.parentElement.removeChild(item);
            consumed = true;
        }
    });

    if (!consumed) return; // Sécurité : l'item a disparu entre-temps

    // --- Récompenses ---
    coins  += mission.reward;
    energy += 15; // Bonus d'énergie pour chaque mission réussie
    if (energy > MAX_ENERGY) energy = MAX_ENERGY;

    showMessage(`+${mission.reward} 🪙  +15 ⚡`);

    // --- Avancement ---
    currentMissionIndex++;

    if (currentMissionIndex >= 3) {
        // Toutes les missions du niveau sont terminées → niveau suivant
        currentMissionIndex = 0;
        currentLevel++;
        _onLevelUp();
    }

    // Plafonnement au niveau maximum
    if (currentLevel > 5) {
        currentLevel        = 5;
        currentMissionIndex = 2;
        showMessage('🎓 Toutes les missions sont terminées !');
    }

    saveGame();
    updateUI();
}

/**
 * Appelé lors du passage au niveau suivant.
 * Affiche un message et lance les confettis.
 */
function _onLevelUp() {
    setTimeout(() => {
        showMessage(`🎉 Félicitations ${playerName} ! Niveau ${currentLevel} débloqué !`);
        fireConfetti();
    }, 300);
}


// ============================================================
// 18. GÉNÉRATEUR (Spawner principal)
// ============================================================

/**
 * Gère le clic sur le générateur (📦) :
 * consomme 1 énergie et fait apparaître un item de niveau 1
 * d'une famille aléatoire (selon la progression du joueur).
 */
function handleGeneratorClick() {
    if (energy <= 0) {
        showMessage("Pas assez d'énergie !");
        // Animation shake pour indiquer l'impossibilité
        this.classList.add('shake-animation');
        setTimeout(() => this.classList.remove('shake-animation'), 400);
        return;
    }

    // Familles disponibles selon la progression
    const possibleFamilies = ['A', 'B']; // Phase 1 : Appareils + Objectifs
    if (currentLevel >= 2) {
        possibleFamilies.push('C'); // Pellicules
        possibleFamilies.push('D'); // Téléphones
    }

    const randomFamily = possibleFamilies[Math.floor(Math.random() * possibleFamilies.length)];

    const spawned = spawnSpecificItem(randomFamily, 1, false);
    if (spawned) {
        energy--;
        if (energy < 0) energy = 0;

        const energyEl = document.getElementById('ui-energy');
        if (energyEl) energyEl.textContent = energy;

        saveGame();
    }
}


// ============================================================
// 19. CONFETTIS
// ============================================================

/**
 * Lance une animation de confettis pendant 5 secondes.
 * Utilisée lors d'un passage de niveau.
 */
function fireConfetti() {
    const container = document.getElementById('confetti');
    if (!container) return;

    container.style.display = 'block';
    container.innerHTML     = '';

    const colors = [
        '#f44336','#e91e63','#9c27b0','#673ab7',
        '#3f51b5','#2196f3','#03a9f4','#00bcd4',
        '#009688','#4CAF50','#8BC34A','#CDDC39',
        '#FFEB3B','#FFC107','#FF9800','#FF5722'
    ];

    for (let i = 0; i < 100; i++) {
        const conf = document.createElement('div');
        conf.className = 'confetti';
        conf.style.left                = Math.random() * 100 + 'vw';
        conf.style.backgroundColor     = colors[Math.floor(Math.random() * colors.length)];
        conf.style.animationDuration   = (Math.random() * 2 + 2) + 's';
        conf.style.animationDelay      = Math.random() * 2 + 's';
        // Variation de forme (carré, rond, rectangle)
        const shapes = ['0%', '50%', '4px'];
        conf.style.borderRadius        = shapes[Math.floor(Math.random() * shapes.length)];
        container.appendChild(conf);
    }

    setTimeout(() => { container.style.display = 'none'; }, 5000);
}


// ============================================================
// 20. INITIALISATION AU CHARGEMENT DE LA PAGE
// ============================================================

/**
 * Séquence de démarrage :
 * 1. L'écran de chargement s'affiche (via HTML/CSS)
 * 2. Après 3.5s, il disparaît en fondu
 * 3. Le menu principal (nouveau) apparaît
 */
window.addEventListener('load', () => {

    // --- Étape 1 : Initialiser l'inventaire (slots vides) ---
    initInventory();

    // --- Étape 2 : Setup du drag-and-drop vers le bouton inventaire ---
    setupInventoryBtnDrop();

    // --- Étape 3 : Disparition de l'écran de chargement ---
    const loader = document.getElementById('loading-screen');

    setTimeout(() => {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';

                // --- Étape 4 : Afficher le NOUVEAU menu principal ---
                const mainMenu = document.getElementById('main-menu');
                if (mainMenu) mainMenu.style.display = 'flex';

            }, 800); // Durée du fondu
        }
    }, 3500); // Durée de l'écran de chargement
});


// ============================================================
// FIN DU FICHIER script.js
// Toute la logique du jeu Merge & Snap est maintenant
// répartie proprement dans 3 fichiers :
//   - index.html  → Structure HTML
//   - style.css   → Tous les styles et animations
//   - script.js   → Toute la logique JavaScript
// ============================================================
