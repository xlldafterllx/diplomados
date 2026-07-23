document.addEventListener(
    "DOMContentLoaded",
    () => {
        restoreSidebarState();
        registerSidebarEvents();
    }
);

function restoreSidebarState() {
    const collapsed = JSON.parse(
        localStorage.getItem("app.sidebar.collapsed")
    );

    if (!collapsed) {
        return;
    }

    document.body.classList.add(
        "sidebar-collapse"
    );
}

function registerSidebarEvents() {
    const button = document.querySelector(
        '[data-lte-toggle="sidebar"]'
    );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        () => {
            setTimeout(
                saveSidebarState,
                50
            );
        }
    );
}

function saveSidebarState() {
    const collapsed = document.body.classList.contains(
        "sidebar-collapse"
    );

    localStorage.setItem(
        "app.sidebar.collapsed",
        JSON.stringify(collapsed)
    );
}