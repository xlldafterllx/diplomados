const Theme = {
    STORAGE_KEY: "lte-theme",

    init() {
        this.apply(this.get());
        this.updateUI();
        this.bindEvents();
    },

    bindEvents() {
        document
            .querySelectorAll("[data-bs-theme-value]")
            .forEach(button => {
                button.addEventListener("click", () => {
                    this.set(
                        button.dataset.bsThemeValue
                    );
                });
            });

        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", () => {
                if (this.get() === "auto") {
                    this.apply("auto");
                    this.updateUI();
                }
            });

    },

    get() {
        return localStorage.getItem(
            this.STORAGE_KEY
        ) ?? "auto";
    },

    set(theme) {
        localStorage.setItem(
            this.STORAGE_KEY,
            theme
        );
        this.apply(theme);
        this.updateUI();
    },

    apply(theme) {
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        let resolvedTheme;

        switch (theme) {
            case "light":
                resolvedTheme = "light";
                break;
            case "dark":
                resolvedTheme = "dark";
                break;
            default:
                resolvedTheme = prefersDark
                    ? "dark"
                    : "light";
                break;
        }

        document.documentElement.setAttribute(
            "data-bs-theme",
            resolvedTheme
        );

        document.documentElement.style.colorScheme =
            resolvedTheme;
    },

    updateUI() {
        const theme = this.get();

        /*
        |--------------------------------------------------------------------------
        | ICONS
        |--------------------------------------------------------------------------
        */

        document
            .querySelectorAll("[data-lte-theme-icon]")
            .forEach(icon => {
                icon.classList.add("d-none");
            });

        document
            .querySelector(
                `[data-lte-theme-icon="${theme}"]`
            )
            ?.classList.remove("d-none");

        /*
        |--------------------------------------------------------------------------
        | DROPDOWN OPTIONS
        |--------------------------------------------------------------------------
        */

        document
            .querySelectorAll("[data-bs-theme-value]")
            .forEach(button => {

                const isActive =
                    button.dataset.bsThemeValue === theme;

                button.classList.toggle(
                    "active",
                    isActive
                );

                button.setAttribute(
                    "aria-pressed",
                    isActive
                );

                const check =
                    button.querySelector(".fa-check");

                if (check) {
                    check.classList.toggle(
                        "d-none",
                        !isActive
                    );
                }
            });
    }
};