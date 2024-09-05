// document.addEventListener("DOMContentLoaded", () => {
//     userLogged("name-user-logged", "nombreApellido");
// })

export default function userLogged(selector, item) {
    const nameUserLogged = document.getElementById(selector);
    if (!nameUserLogged) { 
        console.error(`Elemento con id ${selector} no encontrado`);
        return;
    }
    const nombreApellidoLocalStorage = localStorage.getItem(item);
    if (!nombreApellidoLocalStorage) {
        console.error(`No se encontro el item ${item} en localStorage`);
    } else {
        nameUserLogged.innerText = nombreApellidoLocalStorage;
        console.log(nombreApellidoLocalStorage);
    }
}
