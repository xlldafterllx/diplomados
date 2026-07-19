class NavigationManager {
    static async init() {
        $(document).on("click", "[data-view]", async function (e) {
            e.preventDefault();

            const view = $(this).data("view");
            const title = $(this).find("p").text().trim();

            await NavigationManager.navigate(view, title);
        });

        const urlParams = new URLSearchParams(window.location.search);
        const currentView = urlParams.get("view");

        if (currentView) {
            const title = NavigationManager.getTitle(currentView);

            await NavigationManager.navigate(
                currentView,
                title,
                false
            );

            return;
        }

        await NavigationManager.navigate(
            DEFAULT_VIEW,
            DEFAULT_TITLE,
            false
        );
    }

    static async navigate(view, title, updateUrl = true) {
        const success = await ViewLoader.load(view);

        if (!success) {
            return;
        }

        $("#breadcrumb").html(
            `
                <li class="breadcrumb-item">
                    Inicio
                </li>

                <li class="breadcrumb-item active">
                    ${title}
                </li>
            `
        );

        //$("#title").text(title);
        Breadcrumb.set(title);
        Sidebar.setActive(view);
        Sidebar.closeOnMobile();
        document.title = document.title = `${APP_NAME} | ${title}`;

        if (updateUrl) {
            history.pushState(
                {},
                "",
                `${BASE_URL}index.php?view=${view}`
            );
        }
    }

    static getTitle(view) {
        return $(`[data-view="${view}"]`)
            .find("p")
            .text()
            .trim();
    }
}