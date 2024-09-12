export function saveUserToLS(email, nombreApellido) {

    localStorage.removeItem('loggedUser');

    let users = JSON.parse(localStorage.getItem('users')) || {};
    console.log("Usuarios existentes antes de guardar:", users);

    users[email] = { nombreApellido };
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedUser', email);
    console.log("Usuarios después de guardar en localStorage:", JSON.parse(localStorage.getItem('users')));
    console.log("Usuario logueado:", localStorage.getItem('loggedUser'));
}

function getLoggedInUser() {
    const email = localStorage.getItem('loggedUser');
    console.log("Email del usuario logueado desde localStorage:", email);

    const users = JSON.parse(localStorage.getItem('users')) || {};
    console.log("Usuarios almacenados en localStorage:", users);

    return users[email] || null;
}

export default function userLogged(selector) {
    const nameUserLogged = document.getElementById(selector);
    if (!nameUserLogged) {
        console.error(`Elemento con id ${selector} no encontrado`);
        return;
    }

    const loggedInUser = getLoggedInUser();

    if (!loggedInUser) {
        console.error("No hay usuario logueado o no se pudo recuperar de localStorage.");
        nameUserLogged.innerText = "Usuario no logueado";
    } else {
        nameUserLogged.innerText = loggedInUser.nombreApellido;
        console.log("Nombre del usuario logueado:", loggedInUser.nombreApellido);
    }
}
