// ReLoop Resale Marketplace - Interactive Application State

// Initial Listings Database
let listings = [
    {
        id: 1,
        title: "Vintage Leather Bomber Jacket",
        category: "fashion",
        price: 85.00,
        condition: "Very Good",
        desc: "Classic 90s fit leather bomber jacket, warm inner lining. Minimal distress on elbows, looks incredibly authentic.",
        imageIcon: "🧥"
    },
    {
        id: 2,
        title: "Retro Canvas Backpack",
        category: "bags",
        price: 45.00,
        condition: "Like New",
        desc: "Durable khaki canvas backpack with genuine leather straps. Fits a 15-inch laptop, great for commuting.",
        imageIcon: "🎒"
    },
    {
        id: 3,
        title: "Premium ANC Headphones",
        category: "tech",
        price: 120.00,
        condition: "New",
        desc: "Active noise-cancelling over-ear headphones. Opened only to verify accessories. Original box and cables included.",
        imageIcon: "🎧"
    },
    {
        id: 4,
        title: "Minimalist Suede Desert Boots",
        category: "shoes",
        price: 95.00,
        condition: "Like New",
        desc: "Handcrafted sand-colored suede boots. Worn outdoors exactly once. Extremely comfortable crepe sole.",
        imageIcon: "🥾"
    },
    {
        id: 5,
        title: "Classic Silver Quartz Watch",
        category: "fashion",
        price: 75.00,
        condition: "Good",
        desc: "Minimalist watch with a stainless steel mesh strap. Minor surface scratches on the back casing.",
        imageIcon: "⌚"
    },
    {
        id: 6,
        title: "Full-Grain Leather Wallet",
        category: "bags",
        price: 35.00,
        condition: "New",
        desc: "Slim bi-fold wallet in vegetable-tanned brown leather. Holds 6 cards and cash. Ships in original gift pouch.",
        imageIcon: "💼"
    }
];

// App State
let cart = [];
let activeCategory = "all";
let searchQuery = "";

// DOM Elements
const listingsContainer = document.getElementById("listings-container");
const searchInput = document.getElementById("search-input");
const filterLinks = document.querySelectorAll(".filter-link");
const itemsCountLabel = document.getElementById("items-count");

// Modal Elements
const sellModal = document.getElementById("sell-modal");
const sellBtn = document.getElementById("sell-btn");
const heroSellBtn = document.getElementById("hero-sell-btn");
const closeSellBtn = document.getElementById("close-sell-btn");
const sellForm = document.getElementById("sell-form");

// Cart Elements
const cartBtn = document.getElementById("cart-btn");
const closeCartBtn = document.getElementById("close-cart-btn");
const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-overlay");
const cartItemsContainer = document.getElementById("cart-items");
const cartCountLabel = document.querySelector(".cart-count");
const cartSubtotal = document.getElementById("cart-subtotal");
const cartTotal = document.getElementById("cart-total");

// Checkout Elements
const checkoutBtn = document.getElementById("checkout-btn");
const checkoutModal = document.getElementById("checkout-modal");
const closeCheckoutBtn = document.getElementById("close-checkout-btn");
const checkoutForm = document.getElementById("checkout-form");
const checkoutTotalAmt = document.getElementById("checkout-total-amt");

// Success Elements
const successModal = document.getElementById("success-modal");
const successCloseBtn = document.getElementById("success-close");

// Preset Icon Map for custom submissions
const presetIcons = {
    jacket: "🧥",
    bag: "🎒",
    headphones: "🎧",
    boots: "🥾"
};

// -------------------------------------------------------------
// App Lifecycle
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    renderListings();
    
    // Category Filter Selection
    filterLinks.forEach(link => {
        link.addEventListener("click", () => {
            filterLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            activeCategory = link.getAttribute("data-category");
            renderListings();
        });
    });

    // Searching inputs
    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderListings();
    });

    // Sell Modal Handlers
    sellBtn.addEventListener("click", () => openModal(sellModal));
    heroSellBtn.addEventListener("click", () => openModal(sellModal));
    closeSellBtn.addEventListener("click", () => closeModal(sellModal));
    sellForm.addEventListener("submit", handlePostListing);

    // Cart Drawer Toggle
    cartBtn.addEventListener("click", openCart);
    closeCartBtn.addEventListener("click", closeCart);
    cartOverlay.addEventListener("click", closeCart);

    // Checkout Form
    checkoutBtn.addEventListener("click", openCheckout);
    closeCheckoutBtn.addEventListener("click", () => closeModal(checkoutModal));
    checkoutForm.addEventListener("submit", handlePaymentSubmit);

    // Success dialog
    successCloseBtn.addEventListener("click", () => {
        closeModal(successModal);
        cart = [];
        updateCartUI();
    });
});

// -------------------------------------------------------------
// Render Products Catalog Feed
// -------------------------------------------------------------
function renderListings() {
    listingsContainer.innerHTML = "";

    const filtered = listings.filter(item => {
        const matchCategory = activeCategory === "all" || item.category === activeCategory;
        const matchSearch = item.title.toLowerCase().includes(searchQuery) ||
                            item.desc.toLowerCase().includes(searchQuery);
        return matchCategory && matchSearch;
    });

    itemsCountLabel.textContent = `${filtered.length} item${filtered.length === 1 ? '' : 's'} found`;

    if (filtered.length === 0) {
        listingsContainer.innerHTML = `
            <div class="empty-feed">
                <h3>No listings match your search</h3>
                <p>Try searching another keyword or browsing a different category.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement("div");
        card.className = "listing-card";
        card.innerHTML = `
            <div class="card-img-wrapper">
                <span class="card-badge">${item.condition}</span>
                <div class="card-img-placeholder">${item.imageIcon}</div>
            </div>
            <div class="card-info">
                <h3 class="card-title">${item.title}</h3>
                <p class="card-desc">${item.desc}</p>
                <div class="card-footer">
                    <span class="card-price">$${item.price.toFixed(2)}</span>
                    <button class="btn btn-primary card-action-btn" onclick="handleBuyClick(${item.id})">Buy Now</button>
                </div>
            </div>
        `;
        listingsContainer.appendChild(card);
    });
}

window.handleBuyClick = function(id) {
    addToCart(id);
};

// -------------------------------------------------------------
// Sell Item Submission Flow
// -------------------------------------------------------------
function handlePostListing(e) {
    e.preventDefault();

    const title = document.getElementById("item-title").value;
    const price = parseFloat(document.getElementById("item-price").value);
    const category = document.getElementById("item-category").value;
    const condition = document.getElementById("item-condition").value;
    const desc = document.getElementById("item-desc").value;
    const imgKey = document.getElementById("item-image").value;

    const newListing = {
        id: listings.length + 1,
        title: title,
        category: category,
        price: price,
        condition: condition,
        desc: desc,
        imageIcon: presetIcons[imgKey] || "📦"
    };

    listings.unshift(newListing); // Add to the top of listings
    renderListings();
    
    sellForm.reset();
    closeModal(sellModal);
    
    alert("🎉 Success! Your item has been listed publicly on the marketplace feed.");
}

// -------------------------------------------------------------
// Cart and Checkout Drawer Handlers
// -------------------------------------------------------------
function addToCart(id) {
    const item = listings.find(l => l.id === id);
    if (!item) return;

    // Check if already in cart (resale items are usually single-quantity)
    const exists = cart.some(c => c.id === id);
    if (exists) {
        alert("This unique pre-owned item is already in your cart.");
        openCart();
        return;
    }

    cart.push(item);
    updateCartUI();
    openCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

// Update Cart DOM updates
function updateCartUI() {
    cartCountLabel.textContent = cart.length;
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-state">
                <p>Your shopping cart is empty.</p>
            </div>
        `;
        checkoutBtn.disabled = true;
        cartSubtotal.textContent = "$0.00";
        cartTotal.textContent = "$0.00";
        return;
    }

    checkoutBtn.disabled = false;

    cart.forEach(item => {
        const itemRow = document.createElement("div");
        itemRow.className = "cart-item";
        itemRow.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.title}</h4>
                <span>$${item.price.toFixed(2)}</span>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItemsContainer.appendChild(itemRow);
    });

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartSubtotal.textContent = `$${total.toFixed(2)}`;
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

function openCart() {
    cartDrawer.classList.add("active");
    cartOverlay.classList.add("active");
}

function closeCart() {
    cartDrawer.classList.remove("active");
    cartOverlay.classList.remove("active");
}

function openCheckout() {
    closeCart();
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    checkoutTotalAmt.textContent = `$${total.toFixed(2)}`;
    openModal(checkoutModal);
}

function handlePaymentSubmit(e) {
    e.preventDefault();
    closeModal(checkoutModal);
    openModal(successModal);
    checkoutForm.reset();
}

// -------------------------------------------------------------
// Overlay Helper Actions
// -------------------------------------------------------------
function openModal(modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeModal(modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
}

// Additional Global styles injector for empty views
const extraStyles = document.createElement("style");
extraStyles.innerHTML = `
    .empty-feed {
        grid-column: 1 / -1;
        text-align: center;
        padding: 48px;
        background-color: var(--color-white);
        border: 1px dashed var(--color-border);
        border-radius: var(--border-radius);
    }
    .empty-feed h3 {
        margin-bottom: 8px;
    }
    .empty-cart-state {
        text-align: center;
        color: var(--color-text-sub);
        padding: 40px 0;
    }
`;
document.head.appendChild(extraStyles);
