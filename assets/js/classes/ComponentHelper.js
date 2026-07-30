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

    getAction(name) {
        return this.$context.find(`[data-action="${name}"]`);
    }

    getTable(name) {
        return this.$context.find(`[data-table="${name}"]`);
    }

    setMandatoryFields(fields) {
        this.mandatoryFields = fields;
    }

    setOptionalFields(fields) {
        this.optionalFields = fields;
    }

    open() {
        if (this.isModal) {
            this.$context.modal('show');
        }
    }

    close() {
        if (this.isModal) {
            this.$context.modal('hide');
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

    validateMandatory() {
        try {
            let success = true;

            for (const rowElement of this.mandatoryFields) {
                const element = this.getField(rowElement.field);

                const type = rowElement.type;
                const validation = rowElement.validation ?? null;
                const value = element.val();

                this.removeInvalid(element);

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
                    if (!value || value.length < 1) {
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
                            this.errorMandatoryElement
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
            const key = $element.data('field');

            data[key] = $element.val();

            if ($element.is('select')) {
                data[`${key}-des`] = $element.find('option:selected').text().trim();
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

    setText(name, value) {
        this.getBind(name).text(value);
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

    onAction(action, callback) {
        this.$context.on('click', `[data-action="${action}"]`, callback);
    }

    slideDown(time = 300) {
        this.$context.slideDown(time);
    }

    slideUp(time = 300) {
        this.$context.slideUp(time);
    }

    fadeIn(time = 300) {
        this.$context.fadeIn(time);
    }

    fadeOut(time = 300) {
        this.$context.fadeOut(time);
    }

    show(time = 300) {
        this.$context.show(time);
    }

    hide(time = 300) {
        this.$context.hide(time);
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