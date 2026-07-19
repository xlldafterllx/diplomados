<script>
    (() => {
        "use strict";

        let theme = null;

        try {
            theme = localStorage.getItem("lte-theme");
        } catch (e) { }

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
                resolvedTheme = prefersDark ? "dark" : "light";
                break;
        }

        document.documentElement.setAttribute(
            "data-bs-theme",
            resolvedTheme
        );

        document.documentElement.style.colorScheme =
            resolvedTheme;

    })();
</script>