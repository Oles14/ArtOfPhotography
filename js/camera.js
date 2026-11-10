
document.addEventListener("DOMContentLoaded", () => {

    /* ==================================
       1. ЭЛЕМЕНТЫ ФОТОАППАРАТА
    ================================== */

    const parts = {
        lens: {
            name: "Объектив",
            description:
                "Собирает и направляет свет на матрицу, " +
                "формируя изображение."
        },

        glass: {
            name: "Линзы",
            description:
                "Преломляют свет внутри объектива, " +
                "помогая создать чёткое изображение."
        },

        aperture: {
            name: "Диафрагма",
            description:
                "Регулирует количество света, " +
                "проходящего через объектив."
        },

        shutter: {
            name: "Затвор",
            description:
                "Определяет, как долго свет " +
                "воздействует на матрицу."
        },

        sensor: {
            name: "Матрица",
            description:
                "Преобразует попадающий свет " +
                "в цифровое изображение."
        },

        viewfinder: {
            name: "Видоискатель",
            description:
                "Позволяет наблюдать за кадром " +
                "и выстраивать композицию."
        },

        display: {
            name: "Дисплей",
            description:
                "Показывает изображение, настройки " +
                "камеры и готовые снимки."
        },

        "shutter-button": {
            name: "Кнопка спуска",
            description:
                "Запускает процесс создания фотографии."
        },

        "mode-dial": {
            name: "Колесо режимов",
            description:
                "Позволяет выбирать автоматические " +
                "и ручные режимы съёмки."
        },

        "control-dial": {
            name: "Колесо управления",
            description:
                "Используется для изменения " +
                "параметров съёмки."
        },

        flash: {
            name: "Вспышка",
            description:
                "Создаёт дополнительный свет " +
                "при недостаточном освещении."
        },

        "hot-shoe": {
            name: "Горячий башмак",
            description:
                "Крепление для внешней вспышки " +
                "и других аксессуаров."
        },

        mount: {
            name: "Байонет",
            description:
                "Крепление, соединяющее " +
                "сменный объектив с камерой."
        },

        body: {
            name: "Корпус",
            description:
                "Защищает внутренние компоненты " +
                "камеры и объединяет её элементы."
        },

        processor: {
            name: "Процессор",
            description:
                "Обрабатывает данные с матрицы " +
                "и формирует цифровой снимок."
        },

        memory: {
            name: "Карта памяти",
            description:
                "Хранит созданные фотографии " +
                "и видеозаписи."
        },

        battery: {
            name: "Аккумулятор",
            description:
                "Обеспечивает камеру электроэнергией."
        },

        autofocus: {
            name: "Автофокус",
            description:
                "Автоматически настраивает " +
                "резкость на выбранном объекте."
        },

        stabilizer: {
            name: "Стабилизатор",
            description:
                "Уменьшает размытие изображения " +
                "из-за дрожания камеры."
        },

        "focus-ring": {
            name: "Кольцо фокусировки",
            description:
                "Позволяет вручную настраивать " +
                "резкость изображения."
        },

        "zoom-ring": {
            name: "Кольцо зума",
            description:
                "Изменяет фокусное расстояние " +
                "и масштаб изображения."
        }
    };

    const partName = document.getElementById("camera-part-name");
    const partDescription =
        document.getElementById("camera-part-description");
    const partsList =
        document.getElementById("camera-parts-list");

    const hotspots =
        document.querySelectorAll(".camera-hotspot");

    function selectPart(id) {
        const part = parts[id];

        if (!part || !partName || !partDescription) return;

        partName.textContent = part.name;
        partDescription.textContent = part.description;

        document.querySelectorAll(
            ".camera-hotspot, .camera-part-button"
        ).forEach(element => {
            element.classList.toggle(
                "active",
                element.dataset.part === id
            );
        });
    }

    // Создание кнопок со всеми деталями
    if (partsList) {
        Object.entries(parts).forEach(([id, part]) => {

            const button = document.createElement("button");

            button.type = "button";
            button.className = "camera-part-button";
            button.dataset.part = id;
            button.textContent = part.name;

            button.addEventListener("click", () => {
                selectPart(id);
            });

            partsList.appendChild(button);
        });
    }

    // Наведение и нажатие на точки камеры
    hotspots.forEach(hotspot => {

        hotspot.addEventListener("mouseenter", () => {
            selectPart(hotspot.dataset.part);
        });

        hotspot.addEventListener("focus", () => {
            selectPart(hotspot.dataset.part);
        });

        hotspot.addEventListener("click", () => {
            selectPart(hotspot.dataset.part);
        });
    });

    selectPart("lens");

    /* ==================================
       2. ПЕРЕКЛЮЧЕНИЕ ВИДА КАМЕРЫ
    ================================== */

    const viewButtons =
        document.querySelectorAll(".camera-view-button");

    const cameraViews =
        document.querySelectorAll(".camera-view");

    viewButtons.forEach(button => {

        button.addEventListener("click", () => {

            const selectedView = button.dataset.view;

            viewButtons.forEach(btn => {
                const active = btn === button;

                btn.classList.toggle("active", active);
                btn.setAttribute(
                    "aria-pressed",
                    String(active)
                );
            });

            cameraViews.forEach(view => {
                const active =
                    view.dataset.cameraView === selectedView;

                view.hidden = !active;
                view.classList.toggle("active", active);
            });
        });
    });

    /* ==================================
       3. ТРЕНАЖЁР ЭКСПОЗИЦИИ
    ================================== */

    const aperture =
        document.getElementById("aperture-control");

    const shutter =
        document.getElementById("shutter-control");

    const iso =
        document.getElementById("iso-control");

    const preview =
        document.getElementById("simulator-preview");

    const value =
        document.getElementById("exposure-value");

    const message =
        document.getElementById("exposure-message");

    const indicator =
        document.getElementById("exposure-indicator");

    const reset =
        document.getElementById("camera-reset");

    if (
        aperture && shutter && iso &&
        preview && value && message && indicator
    ) {

        // Исходные значения
        const reference = {
            aperture: 4,
            shutter: 0.008,
            iso: 400
        };

        function updateExposure() {

            const f = Number(aperture.value);
            const t = Number(shutter.value);
            const sensitivity = Number(iso.value);

            // Относительное изменение экспозиции
            // по сравнению с исходными настройками
            const ratio =
                Math.pow(reference.aperture / f, 2) *
                (t / reference.shutter) *
                (sensitivity / reference.iso);

            const ev = Math.log2(ratio);

            const rounded = ev.toFixed(1);
            const sign = ev > 0 ? "+" : "";

            value.textContent = sign + rounded + " EV";

            // Ограничиваем яркость только для визуализации
            const brightness = Math.max(
                0.35,
                Math.min(2.2, Math.pow(2, ev / 3))
            );

            preview.style.filter =
                `brightness(${brightness})`;

            // Шкала от -5 до +5 EV
            const clampedEV = Math.max(
                -5,
                Math.min(5, ev)
            );

            indicator.style.left =
                (50 + clampedEV * 10) + "%";

            if (ev < -0.5) {
                message.textContent =
                    "При выбранных настройках изображение " +
                    "будет темнее относительно исходного примера.";
            } else if (ev > 0.5) {
                message.textContent =
                    "При выбранных настройках изображение " +
                    "будет светлее относительно исходного примера.";
            } else {
                message.textContent =
                    "Яркость близка к исходной. " +
                    "Попробуй изменить один из параметров.";
            }
        }

        aperture.addEventListener("change", updateExposure);
        shutter.addEventListener("change", updateExposure);
        iso.addEventListener("change", updateExposure);

        if (reset) {
            reset.addEventListener("click", () => {

                aperture.value = "4";
                shutter.value = "0.008";
                iso.value = "400";

                updateExposure();
            });
        }

        updateExposure();
    }

});
