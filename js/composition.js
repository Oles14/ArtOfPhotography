
document.addEventListener("DOMContentLoaded", () => {

    const button = document.getElementById("thirds-toggle");
    const overlay = document.getElementById("thirds-overlay");

    if (!button || !overlay) return;

    button.addEventListener("click", () => {

        const isVisible =
            overlay.classList.toggle("visible");

        if (isVisible) {
            button.textContent = "Скрыть сетку";
        } else {
            button.textContent = "Показать сетку";
        }

        button.setAttribute(
            "aria-pressed",
            String(isVisible)
        );
    });

});
