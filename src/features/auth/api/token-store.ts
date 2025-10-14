const _KEY = "access_token";

export const tokenStore = {
    get(): string | null {
        return sessionStorage.getItem(_KEY);
        return localStorage.getItem(_KEY) || sessionStorage.getItem(_KEY);
    },
    set(token: string) {
        this.clear();
        // localStorage.setItem(_KEY, token);
        sessionStorage.setItem(_KEY, token);
    },
    clear() {
        localStorage.removeItem(_KEY);
        sessionStorage.removeItem(_KEY);
    },

};