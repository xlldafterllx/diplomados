class Sidebar {
    static setActive(view) {
        $(".sidebar-menu .nav-link").removeClass("active");
        $(`[data-view="${view}"]`).addClass("active");
    }

    static closeOnMobile() {
        if ($(window).width() < 992) {
            $("body")
                .removeClass("sidebar-open")
                .addClass("sidebar-collapse");
        }
    }
}