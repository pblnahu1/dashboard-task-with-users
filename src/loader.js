document.addEventListener("DOMContentLoaded", () => {
    const fnAddLoader = () => document.getElementById('loader').classList.add("hidden");
    const fnRemoveLoader = () => document.getElementById('loader').classList.remove("hidden");
    const links = document.querySelectorAll('.link-pages');
    links.forEach(link => {
        link.addEventListener('click', (event) => {
            fnRemoveLoader();
            setTimeout(() => {
                window.location.href = event.target.href;
            }, 1000);

            event.preventDefault();
        });
    });

    window.addEventListener('beforeunload', fnRemoveLoader);
});