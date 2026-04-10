/**
 * App — главный контроллер приложения
 */
const App = {
    services: {
        main:   { name: 'Digital-агентство (комплекс)', price: 200000 },
        design: { name: 'Веб-дизайн и UX/UI', price: 85000 },
        logo:   { name: 'Разработка логотипа', price: 25000 }
    },

    async handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim().toLowerCase();
        const password = document.getElementById('regPassword').value;

        try {
            const data = await AuthController.register(name, email, password);
            AuthController.setCurrentUser(data.user);
            CartController.saveLocalCart([]);
            UIController.closeModal('registerModal');
            document.getElementById('registerForm').reset();
            await this.init();
            UIController.showToast('Добро пожаловать, ' + name + '!');
        } catch (err) {
            const el = document.getElementById('registerError');
            if (el) { el.textContent = err.message; el.classList.add('visible'); }
        }
    },

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim().toLowerCase();
        const password = document.getElementById('loginPassword').value;

        try {
            const data = await AuthController.login(email, password);
            AuthController.setCurrentUser(data.user);

            // Загружаем корзину из БД
            try {
                const cartData = await CartController.getCart(email);
                CartController.saveLocalCart(cartData.items || []);
            } catch (err) {}

            UIController.closeModal('loginModal');
            document.getElementById('loginForm').reset();
            await this.init();
            UIController.showToast('С возвращением, ' + data.user.name + '!');
        } catch (err) {
            const el = document.getElementById('loginError');
            if (el) { el.textContent = err.message; el.classList.add('visible'); }
        }
    },

    async logout() {
        AuthController.clearCurrentUser();
        await this.init();
        UIController.showToast('Вы вышли из аккаунта');
    },

    async addToCart(serviceKey) {
        const user = AuthController.getCurrentUser();
        if (!user) {
            UIController.openModal('loginModal');
            UIController.showToast('Войдите, чтобы добавить услугу');
            return;
        }

        const service = this.services[serviceKey];
        if (!service) return;

        const cart = CartController.getLocalCart();
        const existing = cart.find(i => i.service_key === serviceKey);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                service_key: serviceKey,
                service_name: service.name,
                price: service.price,
                quantity: 1
            });
        }

        CartController.saveLocalCart(cart);
        try { await CartController.saveCart(user.email, cart); } catch (err) {}
        this.updateCartBadge(cart);
        UIController.showToast('«' + service.name + '» добавлено в корзину');
    },

    async removeFromCart(idx) {
        const user = AuthController.getCurrentUser();
        if (!user) return;

        const cart = CartController.getLocalCart();
        cart.splice(idx, 1);
        CartController.saveLocalCart(cart);
        try { await CartController.saveCart(user.email, cart); } catch (err) {}
        this.updateCartBadge(cart);
        UIController.renderCart(cart);
    },

    openCart() {
        const cart = CartController.getLocalCart();
        UIController.openCartModal(cart);
    },

    updateCartBadge(cart) {
        const total = cart.reduce((sum, i) => sum + i.quantity, 0);
        UIController.updateCartCount(total);
    },

    async submitRequest(e) {
        e.preventDefault();
        const email = document.getElementById('reqEmail').value.trim();
        const phone = document.getElementById('reqPhone').value.trim();
        const comment = document.getElementById('reqComment').value.trim();

        try {
            await RequestController.submit(email, phone, comment);
            UIController.showToast('Заявка отправлена!');
            e.target.reset();
        } catch (err) {
            UIController.showToast('Ошибка: ' + err.message);
        }
    },

    async init() {
        const user = AuthController.getCurrentUser();
        UIController.updateAuthUI(user);

        if (user) {
            try {
                const cartData = await CartController.getCart(user.email);
                if (cartData.items && cartData.items.length > 0) {
                    CartController.saveLocalCart(cartData.items);
                }
            } catch (err) {}
        }

        const cart = CartController.getLocalCart();
        this.updateCartBadge(cart);
    }
};

// ===================== ИНИЦИАЛИЗАЦИЯ =====================
document.addEventListener('DOMContentLoaded', () => {
    UIController.init();
    App.init();
});

// Если DOM уже загружен (скрипт внизу страницы)
if (document.readyState !== 'loading') {
    UIController.init();
    App.init();
}
