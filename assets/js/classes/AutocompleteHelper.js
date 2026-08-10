class AutocompleteHelper {
    constructor(element, options = {}) {
        this.$element = element instanceof jQuery
            ? element
            : $(element);

        this.options = {
            minLength: 3,
            maxItems: 20,
            appendTo: null,
            source: null,
            renderItem: null,
            onFocus: null,
            onSelect: null,
            onChange: null,
            ...options
        };

        this.init();
    }

    init() {
        const self = this;
        const $modal = this.$element.closest(".modal");
        const appendTo = this.options.appendTo
            ?? ($modal.length ? $modal : "body");

        this.$element.autocomplete({
            minLength: this.options.minLength,
            appendTo,

            source: async function (request, response) {
                try {
                    const value = request.term.trim();

                    if (!value) {
                        response([]);
                        return;
                    }

                    const items = await self.options.source(value);

                    response(
                        self.options.maxItems
                            ? items.slice(0, self.options.maxItems)
                            : items
                    );

                } catch (error) {
                    response([]);

                    console.error(error);

                    Toast.fire({
                        icon: "error",
                        title: error.message ?? "Ocurrió un error al realizar la búsqueda"
                    });
                }
            },

            focus: function (event, ui) {
                if (typeof self.options.onFocus === "function") {
                    return self.options.onFocus(event, ui.item);
                }
            },

            select: function (event, ui) {
                if (typeof self.options.onSelect === "function") {
                    return self.options.onSelect(event, ui.item);
                }
            },

            change: function (event, ui) {
                if (typeof self.options.onChange === "function") {
                    return self.options.onChange(event, ui?.item ?? null);
                }
            }
        });

        if (typeof this.options.renderItem === "function") {
            this.$element
                .autocomplete("instance")
                ._renderItem = function (ul, item) {
                    return self.options.renderItem(ul, item);
                };
        }

        return this;
    }
}