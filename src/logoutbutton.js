function logout() {
    
        const logoutButton = document.getElementById("logout-button");
        if (!logoutButton) {
            console.error(`Elemento con id "logout-button" no encontrado`);
            return;
        }
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("loggedUser");
            // localStorage.removeItem("users");
            console.log("Usuario deslogueado");
        });


    

}