class Loader {
    static show(element = null) {
        this.hide(element);

        // Fullscreen
        if (element === null) {
            $("body").append(
                $(this.template()).addClass("fullscreen")
            );

            return;
        }

        const $element = this.getElement(element);

        $element.addClass("loader-container");

        $element.append(
            $(this.template()).addClass("inside")
        );
    }

    static hide(element = null) {

        // Fullscreen
        if (element === null) {
            $(".app-loader.fullscreen").remove();
            return;
        }

        const $element = this.getElement(element);

        $element.find(".app-loader.inside").remove();

        // Si ya no existen loaders, quitamos la clase auxiliar.
        if ($element.find(".app-loader").length === 0) {
            $element.removeClass("loader-container");
        }
    }

    static getElement(element) {
        // ComponentHelper
        if (element instanceof ComponentHelper) {
            return element.$context;
        }

        // jQuery object, selector o elemento DOM.
        return $(element);
    }

    static template() {
        return `
            <div class="app-loader">
                <div class="app-loader-spinner">
                    <div class="loader-circle one"></div>
                    <div class="loader-circle two"></div>
                    <div class="loader-circle three"></div>
                </div>
            </div>
        `;
    }
}