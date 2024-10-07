export function saveUserToLS(email, nombreApellido, iconProfile, userId) {

    ///////////////////////////////////////////////////////////

    // localStorage.removeItem('loggedUser');

    // let users = JSON.parse(localStorage.getItem('users')) || {};
    // console.log("Usuarios existentes antes de guardar:", users);

    // users[email] = { nombreApellido };
    // localStorage.setItem('users', JSON.stringify(users));
    // localStorage.setItem('loggedUser', email);
    // console.log("Usuarios después de guardar en localStorage:", JSON.parse(localStorage.getItem('users')));
    // console.log("Usuario logueado:", localStorage.getItem('loggedUser'));

    ///////////////////////////////////////////////////////////

    const user = { nombreApellido, iconProfile, userId };
    if (user) {
        localStorage.setItem('loggedUser', JSON.stringify(user));
        console.log("Usuario logueado:", JSON.stringify(user));
    } else {
        console.error("No se pudo recuperar el nombre del usuario...");
        return null;
    }

    // Puedo usar `email` para recuperar y que el usuario pueda ver su email. Pero solo manipulo `nombreApellido` para que el usuario pueda ver su nombre y apellidos.
}

function getLoggedInUser() {

    ///////////////////////////////////////////////////////////

    // const email = localStorage.getItem('loggedUser');
    // console.log("Email del usuario logueado desde localStorage:", email);

    // const users = JSON.parse(localStorage.getItem('users')) || {};
    // console.log("Usuarios almacenados en localStorage:", users);

    // return email || null;

    ///////////////////////////////////////////////////////////

    const user = localStorage.getItem('loggedUser');

    if (!user) {
        console.error("No hay usuario logueado o no se pudo recuperar de localStorage");
        return null;
    }

    try {
        const parsedUser = JSON.parse(user);
        console.log("Datos del Usuario logueado:", parsedUser);
        return parsedUser;
    } catch (error) {
        console.error("Error al parsear los datos desde localStorage:", error);
        return null;
    }
}


export function userIcon(selector) {
    const userIcon = document.getElementById(selector);
    if (!userIcon) {
        console.error(`Elemento con id ${selector} no encontrado`);
        return;
    }
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser || !loggedInUser.iconProfile) { 
        console.log("No hay usuario logueado o no se pudo recuperar la imágen de perfil de localStorage");
        userIcon.src=`http://localhost:8081/uploads/icon-default.png`
        return;
    }

    const img = new Image();
    img.onload = () => userIcon.src = loggedInUser.iconProfile;
    img.onerror = () => {
        console.error("URL de imágen no válida");
    }
    img.src = loggedInUser.iconProfile;
}

export default function userLogged(selector) {
    const nameUserLogged = document.getElementById(selector);
    if (!nameUserLogged) {
        console.error(`Elemento con id ${selector} no encontrado`);
        return;
    }

    const loggedInUser = getLoggedInUser();

    if (!loggedInUser || !loggedInUser.nombreApellido) {
        console.log("No hay usuario logueado o no se pudo recuperar de localStorage");
    } else {
        nameUserLogged.innerText = loggedInUser.nombreApellido;
    }
}
