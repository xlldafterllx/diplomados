const SidebarState = {
    STORAGE_KEY: "sidebarState",
    init() {
        this.apply();
        this.bindEvents();
    },

    bindEvents() {
        window.addEventListener(
            "beforeunload",
            () => {
                this.save();
            }
        );
    },

    get() {
        return {
            bodyClasses: document.body.className
        };
    },

    apply() {
        const state = JSON.parse(
            sessionStorage.getItem(
                this.STORAGE_KEY
            )
        );

        if (!state) {
            return;
        }

        document.body.className = state.bodyClasses;
    },

    save() {
        sessionStorage.setItem(
            this.STORAGE_KEY,
            JSON.stringify(this.get())
        );
    }
};