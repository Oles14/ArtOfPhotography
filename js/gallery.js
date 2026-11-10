
document.addEventListener("DOMContentLoaded", () => {

    // Находим кнопки, карточки и счётчик
    const buttons = document.querySelectorAll(".gallery-filter");
    const cards = document.querySelectorAll(".gallery-card");
    const counter = document.getElementById("gallery-count");

    // Обновление количества фотографий
    function updateCounter() {
        const visibleCards = Array.from(cards).filter(card => {
            return !card.hidden;
        });

        if (counter) {
            counter.textContent =
                `Показано фотографий: ${visibleCards.length}`;
        }
    }

    // Настройка кнопок
    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const selectedCategory = button.dataset.filter;

            // Снимаем выделение с других кнопок
            buttons.forEach(btn => {
                btn.classList.remove("active");
                btn.setAttribute("aria-pressed", "false");
            });

            // Выделяем нажатую кнопку
            button.classList.add("active");
            button.setAttribute("aria-pressed", "true");

            // Фильтруем фотографии
            cards.forEach(card => {

                const category = card.dataset.category;

                const shouldShow =
                    selectedCategory === "all" ||
                    category === selectedCategory;

                card.hidden = !shouldShow;
            });

            updateCounter();
        });
    });

    // Если изображение отсутствует,
    // показываем аккуратную заглушку
    cards.forEach(card => {

        const image = card.querySelector("img");

        if (!image) return;

        function showPlaceholder() {
            card.classList.add("missing-photo");
            image.hidden = true;
        }

        image.addEventListener("error", showPlaceholder);

        if (image.complete && image.naturalWidth === 0) {
            showPlaceholder();
        }

    });

    updateCounter();

});
