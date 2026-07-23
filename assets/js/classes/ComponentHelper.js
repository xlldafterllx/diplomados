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

    getAction(name) {
        return this.$context.find(`[data-action="${name}"]`);
    }

    getTable(name) {
        return this.$context.find(`[data-table="${name}"]`);
    }

    getContainer(name) {
        return this.$context.find(`[data-container="${name}"]`);
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

    validateMandatory() {
        try {
            let success = true;

            for (const rowElement of this.mandatoryFields) {
                const element = this.getField(rowElement.field);
                const type = rowElement.type;
                const validation = rowElement.validation ?? null;
                const value = element.val();

                element.removeClass("is-invalid");

                if (type === "select") {
                    if (value == null) {
                        this.setInvalid(element, rowElement.name, this.errorMandatoryElement);
                        success = false;
                    }
                } else if (type === "select-multiple") {
                    if (!value || value.length < 1) {
                        this.setInvalid(element, rowElement.name, this.errorMandatoryElement);
                        success = false;
                    }
                } else if (type === "datepicker" || type === "input") {
                    if (!value || value.trim() === "") {
                        this.setInvalid(element, rowElement.name, this.errorMandatoryElement);
                        success = false;
                    }
                    else if (validation && this.validators[validation]) {
                        if (!this.validators[validation](value.trim())) {
                            this.setInvalid(element, rowElement.name, this.errorMandatoryElement);
                            success = false;
                        }
                    }
                }
            }
            return success;
        } catch (e) {
            Toast.fire({
                icon: "error",
                title: "Ocurrió un error al validar los controles"
            });
            console.error(e);
            return false;
        }
    }

    validateOptional() {
        try {
            let success = false;

            for (const rowElement of this.optionalFields) {
                const element = this.getField(rowElement.field);
                const type = rowElement.type;
                const validation = rowElement.validation ?? null;
                const value = element.val();

                element.removeClass("is-invalid");

                if (type === "select") {
                    if (value != null) {
                        success = true;
                    }
                } else if (type === "select-multiple") {
                    if (value && value.length > 0) {
                        success = true;
                    }
                } else if (type === "datepicker" || type === "input") {
                    if (value && value.trim() !== "") {
                        success = true;
                    }
                    else if (validation && this.validators[validation]) {
                        if (this.validators[validation](value.trim())) {
                            success = true;
                        }
                    }
                }
            }

            if (!success) {
                for (const rowElement of this.optionalFields) {
                    const element = this.getField(rowElement.field);
                    element.addClass("is-invalid");
                }
                Toast.fire({
                    icon: "warning",
                    title: "Debe llenar al menos un campo de los filtros opcionales"
                });
            }

            return success;
        } catch (e) {
            Toast.fire({
                icon: "error",
                title: "Ocurrió un error al validar los controles"
            });
            console.error(e);
            return false;
        }
    }

    setInvalid(element, name, errorFn) {
        element.addClass("is-invalid");
        errorFn(element, name);
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

    setData(data) {
        Object.keys(data).forEach(key => {
            const $field = this.getField(key);
            if ($field.length) {
                $field.val(data[key]).change();
            }
        });
    }

    setText(name, value) {
        this.getBind(name).text(value);
    }

    clear() {
        this.$context.find('[data-field]').each(function () {
            $(this)
                .val('')
                .removeClass('is-invalid')
                .change();
        });
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