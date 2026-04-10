/**
 * UIController — управление интерфейсом
 */
class UIController {
    static openModal(id) {
        const el = document.getElementById(id);
        if (el) el.classList.add('active');
    }

    static closeModal(id) {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    }

    static switchModal(from, to) {
        this.closeModal(from);
        setTimeout(() => this.openModal(to), 200);
    }

    static showToast(message) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = message;
        toast.style.whiteSpace = 'pre-line';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
    }

    static scrollToForm() {
        const el = document.querySelector('.cta');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }

    static toggleBurger() {
        const burger = document.getElementById('burger');
        const nav = document.querySelector('.header__nav');
        if (burger) burger.classList.toggle('active');
        if (nav) nav.classList.toggle('active');
    }

    static closeBurger() {
        const burger = document.getElementById('burger');
        const nav = document.querySelector('.header__nav');
        if (burger) burger.classList.remove('active');
        if (nav) nav.classList.remove('active');
    }

    static updateCartCount(count) {
        const el = document.getElementById('cartCount');
        if (!el) return;
        if (count > 0) {
            el.textContent = count;
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    }

    static updateAuthUI(user) {
        const greeting = document.getElementById('userGreeting');
        const logoutBtn = document.getElementById('logoutBtn');
        const profileBtn = document.getElementById('profileBtn');

        if (user) {
            if (greeting) {
                greeting.innerHTML = 'Привет, <strong>' + user.name + '</strong>';
                greeting.classList.remove('hidden');
            }
            if (logoutBtn) logoutBtn.classList.remove('hidden');
            if (profileBtn) profileBtn.style.display = 'none';
        } else {
            if (greeting) greeting.classList.add('hidden');
            if (logoutBtn) logoutBtn.classList.add('hidden');
            if (profileBtn) profileBtn.style.display = 'flex';
        }
    }

    static renderCart(cart) {
        const itemsEl = document.getElementById('cartItems');
        const footerEl = document.getElementById('cartFooter');
        if (!itemsEl || !footerEl) return;

        if (!cart || cart.length === 0) {
            itemsEl.innerHTML = '<div class="cart-empty">Корзина пуста</div>';
            footerEl.innerHTML = '';
            return;
        }

        let total = 0;
        let html = '';
        cart.forEach((item, idx) => {
            const sum = item.price * item.quantity;
            total += sum;
            html += '<div class="cart-item">' +
                '<div>' +
                    '<div class="cart-item__name">' + item.service_name + '</div>' +
                    '<div class="cart-item__qty">× ' + item.quantity + '</div>' +
                    '<button class="cart-item__remove" onclick="App.removeFromCart(' + idx + ')">Удалить</button>' +
                '</div>' +
                '<div class="cart-item__price">' + sum.toLocaleString('ru-RU') + ' ₽</div>' +
            '</div>';
        });

        itemsEl.innerHTML = html;
        footerEl.innerHTML = '<div class="cart-total">' +
            '<span class="cart-total__label">Итого:</span>' +
            '<span class="cart-total__sum">' + total.toLocaleString('ru-RU') + ' ₽</span>' +
        '</div>';
    }

    static openCartModal(cart) {
        this.renderCart(cart);
        const modal = document.getElementById('cartModal');
        if (modal) modal.classList.add('active');
    }

    static closeCartModal() {
        const modal = document.getElementById('cartModal');
        if (modal) modal.classList.remove('active');
    }

    static initModals() {
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) overlay.classList.remove('active');
            });
        });

        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            cartModal.addEventListener('click', (e) => {
                if (e.target === cartModal) this.closeCartModal();
            });
        }

        document.querySelectorAll('.header__nav a').forEach(a => {
            a.addEventListener('click', () => this.closeBurger());
        });
    }

    static initForms() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) loginForm.addEventListener('submit', (e) => App.handleLogin(e));

        const registerForm = document.getElementById('registerForm');
        if (registerForm) registerForm.addEventListener('submit', (e) => App.handleRegister(e));

        const ctaForm = document.querySelector('.cta__form');
        if (ctaForm) ctaForm.addEventListener('submit', (e) => App.submitRequest(e));
    }

    static initButtons() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) logoutBtn.addEventListener('click', () => App.logout());
    }

    static init() {
        this.initModals();
        this.initForms();
        this.initButtons();
    }
}

// Глобальные алиасы для onclick/onsubmit атрибутов в HTML
function openCartModal() { App.openCart(); }
function closeCartModal() { UIController.closeCartModal(); }
function removeFromCart(idx) { App.removeFromCart(idx); }
function toggleBurger() { UIController.toggleBurger(); }
function scrollToForm() { UIController.scrollToForm(); }
function openModal(id) { UIController.openModal(id); }
function closeModal(id) { UIController.closeModal(id); }
function switchModal(from, to) { UIController.switchModal(from, to); }
function handleLogin(e) { App.handleLogin(e); }
function handleRegister(e) { App.handleRegister(e); }
function logout() { App.logout(); }
function submitRequest(e) { App.submitRequest(e); }
function addToCart(key) { App.addToCart(key); }
