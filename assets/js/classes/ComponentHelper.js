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
        this.mandatoryFields = [];
        this.optionalFields = [];
    }

    getBind(name) {
        return this.$context.find(`[data-bind="${name}"]`);
    }

    getField(name) {
        return this.$context.find(`[data-field="${name}"]`);
    }

    getFieldContainer(name) {
        return this.$context.find(`[data-field-container="${name}"]`);
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

    setMandatoryFields(fields) {
        this.mandatoryFields = fields;
    }

    setOptionalFields(fields) {
        this.optionalFields = fields;
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

        const instance = control._flatpickr;

        if (instance?.altInput) {
            return $(instance.altInput);
        }

        /*
         * Respaldo por si la instancia no está disponible directamente
         * en el input original.
         */
        const $flatpickrInput = $element
            .siblings(".flatpickr-input")
            .filter(":visible")
            .first();

        if ($flatpickrInput.length) {
            return $flatpickrInput;
        }

        return $element;
    }

    setInvalidClass(element) {
        const validationElement = this.getValidationElement(element);

        element.removeClass("is-invalid");
        validationElement.addClass("is-invalid");

        return validationElement;
    }

    removeInvalid(element) {
        const validationElement = this.getValidationElement(element);

        element.removeClass("is-invalid");
        validationElement.removeClass("is-invalid");

        return validationElement;
    }

    getFieldValue(name) {
        const $field = this.getField(name);
        const value = $field.val();

        if (typeof value === "string") {
            return value.trim();
        }

        return value;
    }

    isMandatoryField(rowElement) {
        const requiredWhen = rowElement.requiredWhen;

        /*
         * Cuando no existe una condición, el campo siempre es obligatorio.
         */
        if (requiredWhen == null) {
            return true;
        }

        /*
         * También permitimos declarar directamente true o false.
         */
        if (typeof requiredWhen === "boolean") {
            return requiredWhen;
        }

        if (typeof requiredWhen !== "function") {
            throw new TypeError(
                `La condición requiredWhen del campo "${rowElement.field}" debe ser una función o un booleano`
            );
        }

        return Boolean(
            requiredWhen({
                component: this,
                getField: name => this.getField(name),
                getValue: name => this.getFieldValue(name),
                getData: () => this.getData()
            })
        );
    }

    validateMandatory() {
        try {
            let success = true;

            for (const rowElement of this.mandatoryFields) {
                const element = this.getField(rowElement.field);

                if (!element.length) {
                    console.warn(
                        `No se encontró el campo obligatorio "${rowElement.field}"`
                    );

                    continue;
                }

                const type = rowElement.type;
                const validation = rowElement.validation ?? null;
                const value = element.val();

                /*
                 * Primero retiramos cualquier estado inválido anterior.
                 *
                 * Esto también limpia el campo cuando antes era obligatorio,
                 * pero dejó de serlo debido al cambio de otro control.
                 */
                this.removeInvalid(element);

                /*
                 * Si la condición no se cumple, el campo no debe validarse.
                 */
                if (!this.isMandatoryField(rowElement)) {
                    continue;
                }

                if (type === "select") {
                    if (value == null || value === "") {
                        this.setInvalid(
                            element,
                            rowElement.name,
                            this.errorMandatoryElement
                        );

                        success = false;
                    }

                    continue;
                }

                if (type === "select-multiple") {
                    if (!Array.isArray(value) || value.length < 1) {
                        this.setInvalid(
                            element,
                            rowElement.name,
                            this.errorMandatoryElement
                        );

                        success = false;
                    }

                    continue;
                }

                if (
                    type === "datepicker" ||
                    type === "timepicker" ||
                    type === "datetimepicker" ||
                    type === "input"
                ) {
                    const normalizedValue = typeof value === "string"
                        ? value.trim()
                        : value;

                    if (!normalizedValue) {
                        this.setInvalid(
                            element,
                            rowElement.name,
                            this.errorMandatoryElement
                        );

                        success = false;

                        continue;
                    }

                    if (
                        validation &&
                        this.validators[validation] &&
                        !this.validators[validation](normalizedValue)
                    ) {
                        this.setInvalid(
                            element,
                            rowElement.name,
                            this.errorInvalidElement
                        );

                        success = false;
                    }
                }
            }

            return success;
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: "Ocurrió un error al validar los controles"
            });

            console.error(error);

            return false;
        }
    }

    validateOptional() {
        try {
            let hasValue = false;
            let hasInvalidValue = false;

            for (const rowElement of this.optionalFields) {
                const element = this.getField(rowElement.field);

                const type = rowElement.type;
                const validation = rowElement.validation ?? null;
                const value = element.val();

                this.removeInvalid(element);

                if (type === "select") {
                    if (value != null && value !== "") {
                        hasValue = true;
                    }

                    continue;
                }

                if (type === "select-multiple") {
                    if (Array.isArray(value) && value.length > 0) {
                        hasValue = true;
                    }

                    continue;
                }

                if (
                    type === "datepicker" ||
                    type === "timepicker" ||
                    type === "datetimepicker" ||
                    type === "input"
                ) {
                    const normalizedValue = typeof value === "string"
                        ? value.trim()
                        : value;

                    if (!normalizedValue) {
                        continue;
                    }

                    hasValue = true;

                    if (
                        validation &&
                        this.validators[validation] &&
                        !this.validators[validation](normalizedValue)
                    ) {
                        this.setInvalid(
                            element,
                            rowElement.name,
                            this.errorInvalidElement
                        );

                        hasInvalidValue = true;
                    }
                }
            }

            if (!hasValue) {
                for (const rowElement of this.optionalFields) {
                    const element = this.getField(rowElement.field);

                    this.setInvalidClass(element);
                }

                Toast.fire({
                    icon: "warning",
                    title: "Debe llenar al menos un campo de los filtros opcionales"
                });

                return false;
            }

            return !hasInvalidValue;
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: "Ocurrió un error al validar los controles"
            });

            console.error(error);

            return false;
        }
    }

    errorInvalidElement(element, elementName) {
        Toast.fire({
            icon: "warning",
            title: `El valor de <b>${elementName}</b> no tiene un formato válido`
        });
    }

    setInvalid(element, name, errorFn) {
        const validationElement = this.setInvalidClass(element);

        errorFn.call(
            this,
            validationElement,
            name
        );
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

    validators = {
        mail: value => /\S+@\S+\.\S+/.test(value),
        cp: value => /^[0-9]{5}$/.test(value)
    }

    errorMandatoryElement(element, elementName) {
        Toast.fire({
            icon: "warning",
            title: "La variable <b>" + elementName + "</b> es obligatoria"
        });
    }
}