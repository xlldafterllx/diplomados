const SidebarPersistence = {
    storageKeys: {
        collapsed: "app.sidebar.collapsed",
        openMenus: "app.sidebar.openMenus"
    },

    init() {
        this.restoreCollapsedState();
        this.restoreOpenMenus();

        this.registerSidebarToggle();
        this.registerTreeviewEvents();

        this.finishRestoration();
    },

    //-------------------------------------------------------------------------
    // Estado colapsado del sidebar
    //-------------------------------------------------------------------------

    restoreCollapsedState() {
        const collapsed = this.getStoredBoolean(
            this.storageKeys.collapsed
        );

        document.body.classList.toggle(
            "sidebar-collapse",
            collapsed
        );

        if (collapsed) {
            document.body.classList.remove("sidebar-open");
        }
    },

    registerSidebarToggle() {
        const button = document.querySelector(
            '[data-lte-toggle="sidebar"]'
        );

        if (!button) {
            return;
        }

        button.addEventListener("click", () => {
            /*
             * Esperamos a que AdminLTE modifique las clases del body.
             */
            setTimeout(() => {
                this.saveCollapsedState();
            }, 100);
        });
    },

    saveCollapsedState() {
        const collapsed = document.body.classList.contains(
            "sidebar-collapse"
        );

        this.setStoredValue(
            this.storageKeys.collapsed,
            collapsed
        );
    },

    //-------------------------------------------------------------------------
    // Menús abiertos
    //-------------------------------------------------------------------------

    restoreOpenMenus() {
        const openMenus = this.getStoredArray(
            this.storageKeys.openMenus
        );

        const menuItems = document.querySelectorAll(
            ".app-sidebar [data-sidebar-key]"
        );

        menuItems.forEach((item) => {
            const key = item.dataset.sidebarKey;
            const shouldBeOpen = openMenus.includes(key);

            item.classList.toggle(
                "menu-open",
                shouldBeOpen
            );
        });
    },

    registerTreeviewEvents() {
        const menuLinks = document.querySelectorAll(
            ".app-sidebar [data-sidebar-key] > .nav-link"
        );

        menuLinks.forEach((link) => {
            link.addEventListener("click", () => {
                /*
                 * AdminLTE debe terminar primero de abrir el menú actual
                 * y cerrar las demás ramas por data-accordion="true".
                 */
                setTimeout(() => {
                    this.saveOpenMenus();
                }, 150);
            });
        });
    },

    saveOpenMenus() {
        const openMenus = Array.from(
            document.querySelectorAll(
                ".app-sidebar [data-sidebar-key].menu-open"
            )
        ).map((item) => {
            return item.dataset.sidebarKey;
        });

        this.setStoredValue(
            this.storageKeys.openMenus,
            openMenus
        );
    },

    //-------------------------------------------------------------------------
    // Finalización
    //-------------------------------------------------------------------------

    finishRestoration() {
        document.documentElement.classList.remove(
            "sidebar-restoring"
        );
    },

    //-------------------------------------------------------------------------
    // LocalStorage
    //-------------------------------------------------------------------------

    getStoredValue(key) {
        const storedValue = localStorage.getItem(key);

        if (storedValue === null) {
            return null;
        }

        try {
            return JSON.parse(storedValue);
        } catch {
            return null;
        }
    },

    getStoredBoolean(key) {
        return this.getStoredValue(key) === true;
    },

    getStoredArray(key) {
        const storedValue = this.getStoredValue(key);

        return Array.isArray(storedValue)
            ? storedValue
            : [];
    },

    setStoredValue(key, value) {
        localStorage.setItem(
            key,
            JSON.stringify(value)
        );
    }
};

SidebarPersistence.init();