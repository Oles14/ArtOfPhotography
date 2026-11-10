
document.addEventListener("DOMContentLoaded", () => {

    // Наборы цветов для разных видов гармонии
    const harmonies = {
        complementary: {
            colors: ["#315E87", "#E9A65D"],
            description:
                "Комплементарная гармония — сочетание " +
                "противоположных цветов, например синего " +
                "и оранжевого. Создаёт сильный контраст."
        },

        analogous: {
            colors: ["#367C58", "#86AA59", "#D6C95A"],
            description:
                "Аналоговая гармония — сочетание соседних " +
                "цветов: зелёного, жёлто-зелёного и жёлтого. " +
                "Выглядит спокойно и естественно."
        },

        triadic: {
            colors: ["#C34B4E", "#4A84B9", "#E4C852"],
            description:
                "Триадная гармония — три цвета, расположенных " +
                "примерно на равном расстоянии в цветовом круге."
        },

        monochrome: {
            colors: ["#203D30", "#456B52", "#83A18A", "#CBDACC"],
            description:
                "Монохромная гармония — сочетание нескольких " +
                "оттенков одного цвета. Создаёт цельное изображение."
        }
    };

    const buttons = document.querySelectorAll(".harmony-button");
    const palette = document.querySelector("#harmony-palette");
    const description = document.querySelector("#harmony-description");

    if (palette && description) {
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                const harmony = harmonies[button.dataset.harmony];

                if (!harmony) return;

                buttons.forEach(btn => {
                    btn.classList.remove("active");
                    btn.setAttribute("aria-pressed", "false");
                });

                button.classList.add("active");
                button.setAttribute("aria-pressed", "true");

                palette.innerHTML = "";

                harmony.colors.forEach(color => {
                    const swatch = document.createElement("div");
                    swatch.className = "harmony-swatch";
                    swatch.style.backgroundColor = color;
                    swatch.title = color;
                    palette.appendChild(swatch);
                });

                description.textContent = harmony.description;
            });
        });
    }

    // Если фотография ещё не добавлена,
    // показываем аккуратную заглушку
    document.querySelectorAll(".light-image img").forEach(img => {

        function showPlaceholder() {
            img.parentElement.classList.add("is-missing");
            img.hidden = true;
        }

        img.addEventListener("error", showPlaceholder);

        if (img.complete && img.naturalWidth === 0) {
            showPlaceholder();
        }
    });

});
