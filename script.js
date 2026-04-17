let products = [];

const DEFAULT_PRODUCTS = [
    { id: 101, name: "سرير كانوبي ملكي", image: "https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
    { id: 102, name: "سرير مخمل فاخر", image: "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
    { id: 103, name: "كومودينو ذهبي", image: "https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" },
    { id: 104, name: "خزانة ملابس عصرية", image: "https://images.pexels.com/photos/1114740/pexels-photo-1114740.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" }
];

function loadProducts() {
    const stored = localStorage.getItem('royal_products');
    if (stored) {
        products = JSON.parse(stored);
    } else {
        products = [...DEFAULT_PRODUCTS];
        saveProducts();
    }
    renderProducts();
}

function saveProducts() {
    localStorage.setItem('royal_products', JSON.stringify(products));
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    if (products.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1; text-align:center;">لا توجد منتجات حالياً</p>';
        return;
    }
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="product-img">
                <img src="${p.image}" alt="منتج فاخر" onerror="this.src='https://placehold.co/300x300/f5efe6/b8902e?text=Luxury'">
            </div>
            <div class="product-info">
                <a href="https://wa.me/966567004349?text=مرحباً%2C%20أريد%20طلب%20${encodeURIComponent(p.name)}" target="_blank" class="btn-wa-order">
                    <i class="fab fa-whatsapp"></i> اطلب الآن
                </a>
            </div>
        </div>
    `).join('');
}

function loadLogo() {
    const logoData = localStorage.getItem('royal_logo');
    const logoImg = document.getElementById('siteLogo');
    if (logoData && logoData !== "") {
        logoImg.src = logoData;
        logoImg.style.display = "block";
        const crown = document.querySelector('.logo .crown-icon');
        if (crown) crown.style.display = "none";
    } else {
        logoImg.style.display = "none";
        const crown = document.querySelector('.logo .crown-icon');
        if (crown) crown.style.display = "inline-block";
    }
}

function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateToggleIcon(true);
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        updateToggleIcon(false);
    }
}

function updateToggleIcon(isDark) {
    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleIcon(newTheme === 'dark');
}

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    initTheme();
    loadLogo();
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
});