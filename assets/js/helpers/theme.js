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
                    this.set(button.dataset.bsThemeValue);
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
        return localStorage.getItem(this.STORAGE_KEY) ?? "auto";
    },

    getResolved() {
        return this.resolve(this.get());
    },

    resolve(theme) {
        if (theme === "light" || theme === "dark") {
            return theme;
        }

        return window
            .matchMedia("(prefers-color-scheme: dark)")
            .matches
                ? "dark"
                : "light";
    },

    set(theme) {
        localStorage.setItem(this.STORAGE_KEY, theme);
        this.apply(theme);
        this.updateUI();
    },

    apply(theme) {
        const resolvedTheme = this.resolve(theme);

        document.documentElement.setAttribute(
            "data-bs-theme",
            resolvedTheme
        );

        document.documentElement.style.colorScheme =
            resolvedTheme;

        document.dispatchEvent(
            new CustomEvent("theme:changed", {
                detail: {
                    theme,
                    resolvedTheme
                }
            })
        );
    },

    updateUI() {
        const theme = this.get();

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

        document
            .querySelectorAll("[data-bs-theme-value]")
            .forEach(button => {
                const isActive =
                    button.dataset.bsThemeValue === theme;

                button.classList.toggle("active", isActive);
                button.setAttribute("aria-pressed", isActive);

                button
                    .querySelector(".fa-check")
                    ?.classList.toggle("d-none", !isActive);
            });
    }
};