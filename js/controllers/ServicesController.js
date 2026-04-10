/**
 * ServicesController — работа с API (базовые HTTP-методы)
 */
class ServicesController {
    static async request(url, options = {}) {
        const defaults = {
            headers: { 'Content-Type': 'application/json' }
        };
        const config = { ...defaults, ...options };
        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }
        const res = await fetch(url, config);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Ошибка сервера');
        return data;
    }

    static get(url) {
        return ServicesController.request(url, { method: 'GET' });
    }

    static post(url, body) {
        return ServicesController.request(url, { method: 'POST', body });
    }
}

/**
 * AuthController — регистрация, вход, выход
 */
class AuthController extends ServicesController {
    static register(name, email, password) {
        return this.post('/api/auth/register', { name, email, password });
    }

    static login(email, password) {
        return this.post('/api/auth/login', { email, password });
    }

    static getCurrentUser() {
        const d = localStorage.getItem('intec_current_user');
        return d ? JSON.parse(d) : null;
    }

    static setCurrentUser(user) {
        localStorage.setItem('intec_current_user', JSON.stringify(user));
    }

    static clearCurrentUser() {
        localStorage.removeItem('intec_current_user');
    }
}

/**
 * CartController — корзина
 */
class CartController extends ServicesController {
    static getCart(email) {
        return this.get('/api/cart?email=' + encodeURIComponent(email));
    }

    static saveCart(email, items) {
        return this.post('/api/cart', { email, items });
    }

    static getLocalCart() {
        const user = AuthController.getCurrentUser();
        if (!user) return [];
        const c = localStorage.getItem('intec_cart_' + user.email);
        return c ? JSON.parse(c) : [];
    }

    static saveLocalCart(cart) {
        const user = AuthController.getCurrentUser();
        if (!user) return;
        localStorage.setItem('intec_cart_' + user.email, JSON.stringify(cart));
    }
}

/**
 * RequestController — заявки
 */
class RequestController extends ServicesController {
    static submit(email, phone, comment) {
        return this.post('/api/request', { email, phone, comment });
    }
}
