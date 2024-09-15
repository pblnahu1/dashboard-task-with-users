window.addEventListener("pageshow", (event) => {
    console.log("pageshow event triggered");
    const isPageReload = event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward";
    console.log("isPageReload:", isPageReload);
    const isLoggedIn = Boolean(localStorage.getItem("loggedUser"));
    console.log("isLoggedIn:", isLoggedIn);

    if (isPageReload && !isLoggedIn) {
        // window.location.href = "./index.html";
        window.location.reload();
    }
});


