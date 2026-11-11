
document.addEventListener("DOMContentLoaded", () => {

    // Находим все изображения внутри основного содержимого сайта
    const images = Array.from(
        document.querySelectorAll("main img:not([data-no-lightbox])")
    );

    // Создаём окно для просмотра фотографий
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Просмотр фотографии");
    lightbox.setAttribute("aria-hidden", "true");

    lightbox.innerHTML = `
        <button class="lightbox-close"
                type="button"
                aria-label="Закрыть фотографию">×</button>

        <button class="lightbox-prev"
                type="button"
                aria-label="Предыдущая фотография">❮</button>

        <div class="lightbox-content">
            <img class="lightbox-image" alt="">

            <p class="lightbox-caption"></p>
            <p class="lightbox-counter"></p>
        </div>

        <button class="lightbox-next"
                type="button"
                aria-label="Следующая фотография">❯</button>
    `;

    document.body.appendChild(lightbox);

    const largeImage = lightbox.querySelector(".lightbox-image");
    const caption = lightbox.querySelector(".lightbox-caption");
    const counter = lightbox.querySelector(".lightbox-counter");

    const closeBtn = lightbox.querySelector(".lightbox-close");
    const prevBtn = lightbox.querySelector(".lightbox-prev");
    const nextBtn = lightbox.querySelector(".lightbox-next");

    let currentGroup = [];
    let currentIndex = 0;
    let previousFocus = null;

    // Получаем группу фотографий
    function getGroup(clickedImage) {

        const groupName = clickedImage.dataset.gallery;

        // Если группа не указана — открываем только одну фотографию
        if (!groupName) {
            return [clickedImage];
        }

        // Иначе собираем все фотографии с одинаковым названием группы
        return images.filter(img =>
            img.dataset.gallery === groupName
        );
    }

    // Показываем выбранную фотографию
    function showImage() {

        const img = currentGroup[currentIndex];

        largeImage.src = img.currentSrc || img.src;
        largeImage.alt = img.alt || "Фотография";

        // Подпись можно указать через data-caption
        caption.textContent =
            img.dataset.caption || img.alt || "";

        counter.textContent =
            `${currentIndex + 1} из ${currentGroup.length}`;

        // Стрелки нужны только для групп из нескольких фотографий
        const hasMultiple = currentGroup.length > 1;

        prevBtn.hidden = !hasMultiple;
        nextBtn.hidden = !hasMultiple;
    }

    // Открываем просмотрщик
    function openLightbox(clickedImage) {

        currentGroup = getGroup(clickedImage);
        currentIndex = currentGroup.indexOf(clickedImage);

        previousFocus = document.activeElement;

        showImage();

        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");

        document.body.classList.add("lightbox-open");

        closeBtn.focus();
    }

    // Закрываем просмотрщик
    function closeLightbox() {

        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");

        document.body.classList.remove("lightbox-open");

        largeImage.removeAttribute("src");

        if (previousFocus && previousFocus.focus) {
            previousFocus.focus();
        }
    }

    // Следующая фотография
    function nextImage() {
        if (currentGroup.length < 2) return;

        currentIndex =
            (currentIndex + 1) % currentGroup.length;

        showImage();
    }

    // Предыдущая фотография
    function prevImage() {
        if (currentGroup.length < 2) return;

        currentIndex =
            (currentIndex - 1 + currentGroup.length)
            % currentGroup.length;

        showImage();
    }

    // Делаем обычные изображения открываемыми
    images.forEach(img => {

        img.classList.add("lightbox-trigger");
        img.setAttribute("tabindex", "0");
        img.setAttribute("role", "button");
        img.setAttribute("aria-label",
            "Увеличить: " + (img.alt || "фотографию")
        );

        img.addEventListener("click", () => {
            if (img.naturalWidth > 0) {
                openLightbox(img);
            }
        });

        img.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();

                if (img.naturalWidth > 0) {
                    openLightbox(img);
                }
            }
        });
    });

    closeBtn.addEventListener("click", closeLightbox);
    nextBtn.addEventListener("click", nextImage);
    prevBtn.addEventListener("click", prevImage);

    // Закрытие при нажатии на фон
    lightbox.addEventListener("click", event => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    // Управление клавиатурой
    document.addEventListener("keydown", event => {

        if (!lightbox.classList.contains("active")) return;

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowRight") {
            nextImage();
        }

        if (event.key === "ArrowLeft") {
            prevImage();
        }

        // Удерживаем фокус внутри открытого окна
        if (event.key === "Tab") {
            const buttons = [closeBtn, prevBtn, nextBtn]
                .filter(button => !button.hidden);

            const index = buttons.indexOf(document.activeElement);

            if (event.shiftKey &&
                (index <= 0)) {
                event.preventDefault();
                buttons[buttons.length - 1].focus();
            } else if (!event.shiftKey &&
                       (index === buttons.length - 1 || index === -1)) {
                event.preventDefault();
                buttons[0].focus();
            }
        }
    });
});


/* =========================================
   КАСТОМИЗАЦИЯ: СВЕТЛАЯ И ТЁМНАЯ ТЕМА
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const root = document.documentElement;

    // Восстанавливаем сохранённую тему
    let savedTheme = "light";

    try {
        savedTheme = localStorage.getItem("photo-theme") || "light";
    } catch (error) {
        // Если сохранение недоступно,
        // используется светлая тема
    }

    if (savedTheme !== "dark") {
        savedTheme = "light";
    }

    root.setAttribute("data-theme", savedTheme);

    // Находим шапку сайта
    // Поддерживаются обе версии HTML
    const header = document.querySelector(
        ".site-header .header-inner, .header"
    );

    if (!header) return;

    // Создаём кнопку переключения
    const themeButton = document.createElement("button");

    themeButton.type = "button";
    themeButton.className = "theme-toggle";

    // Добавляем кнопку в шапку
    header.appendChild(themeButton);

    // Обновление внешнего вида кнопки
    function updateThemeButton() {

        const isDark =
            root.getAttribute("data-theme") === "dark";

        themeButton.textContent = isDark
            ? "☀ Светлая тема"
            : "☾ Тёмная тема";

        themeButton.setAttribute(
            "aria-label",
            isDark
                ? "Включить светлую тему"
                : "Включить тёмную тему"
        );

        themeButton.setAttribute(
            "aria-pressed",
            String(isDark)
        );
    }

    // Переключение темы при нажатии
    themeButton.addEventListener("click", () => {

        const currentTheme =
            root.getAttribute("data-theme");

        const newTheme =
            currentTheme === "dark" ? "light" : "dark";

        root.setAttribute("data-theme", newTheme);

        // Сохраняем выбор пользователя
        try {
            localStorage.setItem("photo-theme", newTheme);
        } catch (error) {
            // Переключение продолжает работать,
            // даже если сохранение недоступно
        }

        updateThemeButton();
    });

    updateThemeButton();

});
