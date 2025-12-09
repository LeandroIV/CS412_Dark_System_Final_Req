const shopItems = [
    {
        id: 1,
        name: 'Peely',
        rarity: 'Legendary',
        rarityClass: 'rarity-legendary',
        price: 1200,
        image: 'src/images/Peely_29_-_Outfit_-_Fortnite.webp',
        section: 'daily',
        new: true
    },
    {
        id: 2,
        name: 'Cuddle Team Leader',
        rarity: 'Legendary',
        rarityClass: 'rarity-legendary',
        price: 1200,
        image: 'src/images/New_Cuddle_Team_Leader.webp',
        section: 'daily'
    },
    {
        id: 3,
        name: 'Ramirez Elite Agent',
        rarity: 'Epic',
        rarityClass: 'rarity-epic',
        price: 800,
        image: 'src/images/BattleRoyaleSkin65.webp',
        section: 'daily',
        new: true
    },
    {
        id: 4,
        name: 'Aerial Assault One',
        rarity: 'Rare',
        rarityClass: 'rarity-rare',
        price: 600,
        image: 'https://media.fortniteapi.io/images/5faac16-a689b3b-7e27a23-1279057/transparent.png',
        section: 'daily'
    },
    {
        id: 5,
        name: 'Sign Spinner',
        rarity: 'Rare',
        rarityClass: 'rarity-rare',
        price: 500,
        image: 'src/images/Sign_Spinner_-_Emote_-_Fortnite.webp',
        section: 'limited'
    },
    {
        id: 6,
        name: 'Diamond Pony',
        rarity: 'Epic',
        rarityClass: 'rarity-epic',
        price: 500,
        image: 'src/images/Diamond_Pony_29_-_Glider_-_Fortnite.webp',
        section: 'limited',
        new: true
    },
    {
        id: 7,
        name: 'The Lament',
        rarity: 'Uncommon',
        rarityClass: 'rarity-uncommon',
        price: 800,
        image: 'src/images/The_Lament_29_-_Pickaxe_-_Fortnite.webp',
        section: 'limited'
    },
    {
        id: 8,
        name: 'Hench Hauler',
        rarity: 'Legendary',
        rarityClass: 'rarity-legendary',
        price: 400,
        image: 'src/images/Hench_Hauler.webp',
        section: 'limited'
    }
];

let vbucks = 5000;
let isDarkMode = true;
let pendingPurchase = null;
let isHolding = false;
let holdProgress = 0;
let holdInterval = null;

const selectors = {
    modeToggle: document.getElementById('mode-toggle'),
    modeBanner: document.getElementById('mode-banner'),
    vbucksDisplay: document.getElementById('vbucks-amount'),
    dailyShop: document.getElementById('daily-shop'),
    limitedShop: document.getElementById('limited-shop'),
    modalOverlay: document.getElementById('modal-overlay'),
    holdConfirmBtn: document.getElementById('hold-confirm-btn'),
    darkModalOverlay: document.getElementById('dark-modal-overlay'),
    darkModalImage: document.getElementById('dark-modal-item-image'),
    darkModalName: document.getElementById('dark-modal-item-name'),
    darkModalRarity: document.getElementById('dark-modal-item-rarity'),
    darkModalSubtitle: document.getElementById('dark-modal-subtitle'),
    darkModalMessage: document.getElementById('dark-modal-message'),
    darkModalItemLabel: document.getElementById('dark-modal-item-label'),
    darkModalPrice: document.getElementById('dark-modal-price'),
    darkCloseBtn: document.getElementById('dark-close-btn')
};

function init() {
    renderShop();
    setupEventListeners();
    window.closeModal = closeModal;
    window.closeDarkModal = closeDarkModal;
}

function renderShop() {
    selectors.dailyShop.innerHTML = '';
    selectors.limitedShop.innerHTML = '';

    shopItems.forEach(item => {
        const card = createItemCard(item);
        if (item.section === 'daily') {
            selectors.dailyShop.appendChild(card);
        } else {
            selectors.limitedShop.appendChild(card);
        }
    });
}

function selectItem(itemId) {
    document.querySelectorAll('.item-card').forEach(card => card.classList.remove('selected'));
    const card = document.querySelector(`.item-card[data-item-id="${itemId}"]`);
    if (card) {
        card.classList.add('selected');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function createItemCard(item) {
    const card = document.createElement('div');
    const isFeatured = item.section === 'daily' && (item.new || item.price >= 1000);
    card.className = `item-card ${item.new ? 'new' : ''} ${isFeatured ? 'featured' : ''}`.trim();
    card.setAttribute('data-item-id', String(item.id));
    card.innerHTML = `
        <div class="item-image">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='${fallbackImage(item)}'">
        </div>
        <div class="item-info">
            <div class="item-name">${item.name}</div>
            <div class="item-rarity ${item.rarityClass}">${item.rarity}</div>
            <div class="item-footer">
                <div class="item-price">${item.price}</div>
                <div class="price-badge" role="button" tabindex="0" aria-label="Buy ${item.name} for ${item.price} V-Bucks">
                    <div class="vb-icon">V</div>
                    <div>${item.price}</div>
                </div>
            </div>
        </div>
    `;

    card.addEventListener('click', () => selectItem(item.id));
    const priceBadge = card.querySelector('.price-badge');
    if (priceBadge) {
        priceBadge.addEventListener('click', event => {
            event.stopPropagation();
            handlePurchaseClick(item.id);
        });
        priceBadge.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.stopPropagation();
                handlePurchaseClick(item.id);
            }
        });
    }

    return card;
}

function fallbackImage(item) {
    return `https://via.placeholder.com/200?text=${encodeURIComponent(item.name)}`;
}

function setupEventListeners() {
    selectors.modeToggle.addEventListener('click', toggleMode);
    selectors.holdConfirmBtn.addEventListener('mousedown', startHold);
    selectors.holdConfirmBtn.addEventListener('mouseup', endHold);
    selectors.holdConfirmBtn.addEventListener('mouseleave', endHold);
    selectors.holdConfirmBtn.addEventListener('touchstart', startHold);
    selectors.holdConfirmBtn.addEventListener('touchend', endHold);

    if (selectors.darkCloseBtn) {
        selectors.darkCloseBtn.addEventListener('click', closeDarkModal);
    }

    if (selectors.darkModalOverlay) {
        selectors.darkModalOverlay.addEventListener('click', event => {
            if (event.target === selectors.darkModalOverlay) {
                closeDarkModal();
            }
        });
    }
}

function toggleMode() {
    isDarkMode = !isDarkMode;
    selectors.modeToggle.classList.toggle('active');

    if (isDarkMode) {
        selectors.modeBanner.className = 'mode-banner dark';
        selectors.modeBanner.innerHTML = '⚡ INSTANT PURCHASE MODE - One-click buying enabled (Dark Pattern)';
    } else {
        selectors.modeBanner.className = 'mode-banner ethical';
        selectors.modeBanner.innerHTML = '✓ ETHICAL MODE - Confirmation & Hold-to-confirm protection enabled';
    }
}

function handlePurchaseClick(itemId) {
    const item = shopItems.find(i => i.id === itemId);
    if (!item) return;

    if (vbucks < item.price) {
        showNotification('Not enough V-Bucks!', 'error');
        return;
    }

    if (isDarkMode) {
        completePurchase(item, { showNotification: false });
        showDarkCongrats(item);
    } else {
        openModal(item);
    }
}

function openModal(item) {
    pendingPurchase = item;
    const balanceAfter = vbucks - item.price;

    document.getElementById('modal-item-image').src = item.image;
    document.getElementById('modal-item-name').textContent = item.name;
    const rarityEl = document.getElementById('modal-item-rarity');
    rarityEl.textContent = item.rarity;
    rarityEl.className = `modal-item-rarity ${item.rarityClass}`;
    document.getElementById('modal-item-price').textContent = item.price;
    document.getElementById('modal-current-balance').textContent = vbucks;
    document.getElementById('modal-balance-after').textContent = balanceAfter;

    holdProgress = 0;
    updateHoldButton();

    selectors.modalOverlay.classList.add('active');
}

function closeModal() {
    selectors.modalOverlay.classList.remove('active');
    pendingPurchase = null;
    isHolding = false;
    holdProgress = 0;
    clearInterval(holdInterval);
    updateHoldButton();
}

function showDarkCongrats(item) {
    if (!selectors.darkModalOverlay) return;
    if (selectors.darkModalImage) {
        selectors.darkModalImage.src = item.image;
        selectors.darkModalImage.onerror = () => {
            selectors.darkModalImage.onerror = null;
            selectors.darkModalImage.src = fallbackImage(item);
        };
    }
    if (selectors.darkModalName) {
        selectors.darkModalName.textContent = item.name;
    }
    if (selectors.darkModalRarity) {
        selectors.darkModalRarity.textContent = item.rarity;
        selectors.darkModalRarity.className = `modal-item-rarity ${item.rarityClass}`;
    }
    if (selectors.darkModalItemLabel) {
        selectors.darkModalItemLabel.textContent = item.name;
    }
    if (selectors.darkModalPrice) {
        selectors.darkModalPrice.textContent = `${item.price} V-Bucks`;
    }
    if (selectors.darkModalSubtitle) {
        selectors.darkModalSubtitle.textContent = 'Instant purchase completed';
    }

    selectors.darkModalOverlay.classList.add('active');
}

function closeDarkModal() {
    if (!selectors.darkModalOverlay) return;
    selectors.darkModalOverlay.classList.remove('active');
}

function startHold() {
    if (!pendingPurchase || isHolding) return;
    isHolding = true;
    holdProgress = 0;
    selectors.holdConfirmBtn.style.setProperty('--progress', '0%');

    holdInterval = setInterval(() => {
        holdProgress += 4;
        if (holdProgress >= 100) {
            holdProgress = 100;
            clearInterval(holdInterval);
            setTimeout(() => {
                completePurchase(pendingPurchase);
                closeModal();
            }, 80);
            updateHoldButton();
            return;
        }
        updateHoldButton();
    }, 16);
}

function endHold() {
    if (!isHolding) return;
    isHolding = false;
    clearInterval(holdInterval);

    if (holdProgress < 100) {
        holdProgress = 0;
        updateHoldButton();
    }
}

function updateHoldButton() {
    const width = Math.max(0, Math.min(100, holdProgress));
    selectors.holdConfirmBtn.style.setProperty('--progress', `${width}%`);
    const holdTextEl = document.getElementById('hold-text');
    if (!holdTextEl) return;

    if (width === 0) {
        holdTextEl.textContent = 'Hold to Confirm';
    } else if (width >= 100) {
        holdTextEl.textContent = 'Confirming...';
    } else {
        holdTextEl.textContent = `Hold ${Math.round(width)}%`;
    }
}

function completePurchase(item, options = {}) {
    const { showNotification: shouldNotify = true } = options;
    vbucks -= item.price;
    selectors.vbucksDisplay.textContent = vbucks;

    if (shouldNotify) {
        const mode = isDarkMode ? '⚡ INSTANT' : '✓ VERIFIED';
        const message = `${mode} PURCHASE: ${item.name} (${item.price} V-Bucks)`;
        showNotification(message, isDarkMode ? 'info' : 'success');
    }
}

function showNotification(message, type) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = message;

    container.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', init);
