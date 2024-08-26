// Funciones auxiliares para operaciones comunes
export function validarUsername(username) {
    return username && username.length > 2;
}

export function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}