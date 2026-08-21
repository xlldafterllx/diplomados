class ComponentHelper {
    //-------------------------------------------------------------------------
    // Static methods
    //-------------------------------------------------------------------------
    static cards(context = document) {
        const $context = $(context);

        $context
            .find('[data-lte-toggle="card-collapse"]')
            .off("click")
            .on("click", function (event) {
                event.preventDefault();
                new adminlte.CardWidget(this).toggle();
            });


        $context
            .find('[data-lte-toggle="card-remove"]')
            .off("click")
            .on("click", function (event) {
                event.preventDefault();
                new adminlte.CardWidget(this).remove();
            });


        $context
            .find('[data-lte-toggle="card-maximize"]')
            .off("click")
            .on("click", function (event) {
                event.preventDefault();
                new adminlte.CardWidget(this).toggleMaximize();
            });
    }

    //-------------------------------------------------------------------------
    // Instance methods
    //-------------------------------------------------------------------------

    constructor(selector) {
        this.$context = $(selector);
        this.isModal = this.$context.hasClass("modal");
    }

    getBind(name) {
        return this.$context.find(`[data-bind="${name}"]`);
    }

    getField(name) {
        return this.$context.find(`[data-field="${name}"]`);
    }

    getFieldContainer(name) {
        const $container = this.$context.find(`[data-field-container="${name}"]`);

        if ($container.length) {
            return $container;
        }

        return this
            .getField(name)
            .first()
            .closest(".field");
    }

    getContainer(name) {
        return this.$context.find(`[data-container="${name}"]`);
    }

    getAction(name = null) {
        if (name === null) {
            return this.$context.find("[data-action]");
        }

        return this.$context.find(`[data-action="${name}"]`);
    }

    getTable(name) {
        return this.$context.find(`[data-table="${name}"]`);
    }

    getElement(selector) {
        return this.$context.find(selector);
    }

    open() {
        if (this.isModal) {
            this.$context.modal("show");
        }
    }

    close() {
        if (this.isModal) {
            this.$context.modal("hide");
        }
    }

    buttonOn(name) {
        const button = this.getAction(name);
        button.prop("disabled", false);
        button.find(".spinner-load").css("display", "inline-block");
        button.find(".spinner-loading").css("display", "none");
    }

    buttonOff(name) {
        const button = this.getAction(name);
        button.prop("disabled", true);
        button.find(".spinner-load").css("display", "none");
        button.find(".spinner-loading").css("display", "inline-block");
    }

    getValidationElement(element) {
        const $element = element instanceof jQuery
            ? element
            : $(element);

        const control = $element[0];

        if (!control) {
            return $element;
        }

        /*
         * Flatpickr
         */
        const flatpickrInstance = control._flatpickr;

        if (flatpickrInstance?.altInput) {
            return $(
                flatpickrInstance.altInput
            );
        }

        const $flatpickrInput = $element
            .siblings(".flatpickr-input")
            .filter(":visible")
            .first();

        if ($flatpickrInput.length) {
            return $flatpickrInput;
        }

        /*
         * Select2
         */
        /*if ($element.hasClass("select2-hidden-accessible")) {
            const $selection = $element
                .next(".select2-container")
                .find(".select2-selection")
                .first();

            if ($selection.length) {
                return $selection;
            }
        }*/

        /*
         * Input normal
         */
        return $element;
    }

    setInvalidClass(element) {
        const validationElement = this.getValidationElement(element);

        element.removeClass("is-invalid");
        validationElement.addClass("is-invalid");

        return validationElement;
    }

    removeInvalid(element) {
        const $element =
            element instanceof jQuery
                ? element
                : $(element);

        const $validationElement =
            this.getValidationElement(
                $element
            );

        $element.removeClass(
            "is-invalid"
        );

        $validationElement.removeClass(
            "is-invalid"
        );

        const fieldName =
            $element.data("field");

        if (fieldName) {
            this.getFieldContainer(fieldName)
                .find(".invalid-feedback")
                .first()
                .text("")
                .removeClass("d-block");
        }

        return $validationElement;
    }

    clearValidation(name = null) {
        /*
         * Limpiar un solo campo.
         */
        if (name !== null) {
            const $field =
                this.getField(name);

            if ($field.length) {
                this.removeInvalid($field);
            }

            return this;
        }

        /*
         * Limpiar todos.
         */
        const component = this;

        this.$context
            .find("[data-field]")
            .each(function () {
                component.removeInvalid(
                    $(this)
                );
            });

        return this;
    }

    clearValidationGroups() {
        this.$context
            .find("[data-validation-group]")
            .text("")
            .removeClass("d-block");

        return this;
    }

    getFieldValue(name) {
        const $field = this.getField(name);
        const value = $field.val();

        if (typeof value === "string") {
            return value.trim();
        }

        return value;
    }

    setInvalid(name, message = "") {
        const $field =
            this.getField(name);

        if (!$field.length) {
            return this;
        }

        this.setInvalidClass(
            $field
        );

        this.getFieldContainer(name)
            .find(".invalid-feedback")
            .first()
            .text(message)
            .addClass("d-block");

        return this;
    }

    setInvalidGroup(fields, group, message = "") {
        for (const field of fields) {
            const $element = this.getField(field);

            if (!$element.length) {
                continue;
            }

            this.setInvalidClass(
                $element
            );
        }

        this.$context
            .find(
                `[data-validation-group="${group}"]`
            )
            .text(message)
            .addClass("d-block");

        return this;
    }

    getData() {
        const data = {};

        this.$context.find('[data-field]').each(function () {
            const $element = $(this);
            const key = $element.data("field");

            data[key] = $element.val();

            if ($element.is("select")) {
                data[`${key}-des`] = $element.find("option:selected").text().trim();
            }

            if ($element.is(":file")) {
                data[`${key}`] = $element[0].files[0] ?? null;
            }
        });

        return data;
    }

    setData(data, options = {}) {
        const {
            triggerChange = true
        } = options;

        Object.entries(data).forEach(([key, value]) => {
            const $field = this.getField(key);

            if (!$field.length) {
                return;
            }

            const flatpickrInstance = $field[0]._flatpickr;

            if (flatpickrInstance) {
                flatpickrInstance.setDate(
                    value || null,
                    triggerChange
                );

                this.removeInvalid($field);

                return;
            }

            $field.val(value);

            if ($field.is("select")) {
                $field.trigger(
                    triggerChange
                        ? "change"
                        : "change.select2"
                );

                return;
            }

            if (triggerChange) {
                $field.trigger("change");
            }
        });

        return this;
    }

    setBinds(data) {
        Object.entries(data).forEach(([key, value]) => {
            const $field = this.getBind(key);

            if (!$field.length) {
                return;
            }

            $field.text(value);
        });

        return this;
    }

    setText(name, value) {
        this.getBind(name).text(value);
    }

    setHtml(html) {
        this.$context.html(html);

        return this;
    }

    clear(options = {}) {
        const {
            triggerChange = false
        } = options;

        const component = this;

        this.$context
            .find("[data-field]")
            .each(function () {
                const $field = $(this);

                /*
                 * Flatpickr debe limpiarse mediante su propia instancia.
                 */
                if ($field[0]._flatpickr) {
                    $field[0]._flatpickr.clear();

                    component.removeInvalid($field);

                    if (triggerChange) {
                        $field.trigger("change");
                    }

                    return;
                }

                $field.val("");

                component.removeInvalid($field);

                if ($field.is("select")) {
                    $field.trigger(
                        triggerChange
                            ? "change"
                            : "change.select2"
                    );

                    return;
                }

                if (triggerChange) {
                    $field.trigger("change");
                }
            });

        return this;
    }

    onAction(action, callback, namespace = "component") {
        const event = `click.${namespace}`;

        const selector = action
            ? `[data-action="${action}"]`
            : "[data-action]";

        this.$context
            .off(event, selector)
            .on(event, selector, callback);

        return this;
    }

    resolveElement(element = null) {
        if (element === null) {
            return this.$context;
        }

        if (element instanceof jQuery) {
            return element;
        }

        if (
            element instanceof HTMLElement ||
            element === document ||
            element === window
        ) {
            return $(element);
        }

        if (typeof element === "string") {
            return this.$context.find(element);
        }

        throw new TypeError(
            "El elemento debe ser un selector, HTMLElement o instancia de jQuery"
        );
    }

    disableElementFields(element) {
        const $element = this.resolveElement(element);

        $element
            .find(":input")
            .addBack(":input")
            .each(function () {
                const $field = $(this);

                /*
                 * Solo marcamos los campos que estaban habilitados.
                 */
                if (!$field.prop("disabled")) {
                    $field
                        .attr(
                            "data-component-disabled",
                            "true"
                        )
                        .prop("disabled", true);
                }
            });

        $element.addClass("disabled-container");

        return $element;
    }

    enableElementFields(element) {
        const $element = this.resolveElement(element);

        $element
            .find(
                '[data-component-disabled="true"]'
            )
            .addBack(
                '[data-component-disabled="true"]'
            )
            .each(function () {
                $(this)
                    .prop("disabled", false)
                    .removeAttr(
                        "data-component-disabled"
                    );
            });

        $element.removeClass("disabled-container");

        return $element;
    }

    hideFieldContainer(name, effect = "fadeOut", time = 300) {
        const element = this.getFieldContainer(name);
        element.addClass("disabled");

        if (typeof this[effect] !== "function") {
            throw new Error(
                `El efecto "${effect}" no está disponible`
            );
        }

        this[effect](element, time);

        return this;
    }

    showFieldContainer(name, effect = "fadeIn", time = 300) {
        const element = this.getFieldContainer(name);
        element.removeClass("disabled")

        if (typeof this[effect] !== "function") {
            throw new Error(
                `El efecto "${effect}" no está disponible`
            );
        }

        this[effect](element, time);

        return this;
    }

    slideDown(element = null, time = 300) {
        const $element = this.resolveElement(element);

        this.enableElementFields($element);
        $element.stop(true, true).slideDown(time);

        return this;
    }

    slideUp(element = null, time = 300) {
        const $element = this.resolveElement(element);

        this.disableElementFields($element);
        $element.stop(true, true).slideUp(time);

        return this;
    }

    fadeIn(element = null, time = 300) {
        const $element = this.resolveElement(element);

        this.enableElementFields($element);
        $element.stop(true, true).fadeIn(time);

        return this;
    }

    fadeOut(element = null, time = 300) {
        const $element = this.resolveElement(element);

        this.disableElementFields($element);
        $element.stop(true, true).fadeOut(time);

        return this;
    }

    show(element = null, time = 300) {
        const $element = this.resolveElement(element);

        this.enableElementFields($element);
        $element.stop(true, true).show(time);

        return this;
    }

    hide(element = null, time = 300) {
        const $element = this.resolveElement(element);

        this.disableElementFields($element);
        $element.stop(true, true).hide(time);

        return this;
    }
}