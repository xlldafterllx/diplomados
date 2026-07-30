class InputHelper {

    //-------------------------------------------------------------------------
    // Configuración
    //-------------------------------------------------------------------------

    static defaults = {
        context: null,
        allowEmpty: true,
        validateOnInput: true,
        validateOnBlur: true,
        clearOnBlurError: false,
        showToast: true,
        toastCooldown: 1000,
        message: "El valor ingresado no es válido."
    };

    //-------------------------------------------------------------------------
    // Reglas predefinidas
    //-------------------------------------------------------------------------

    static integer(field, options = {}) {
        const {
            min = null,
            max = null,
            ...config
        } = options;

        return this.apply(field, {
            ...config,

            inputValidator(value) {
                return /^-?\d*$/.test(value);
            },

            blurValidator(value) {
                return InputHelper.validateRange(value, {
                    min,
                    max,
                    parser: Number
                });
            },

            message: config.message ?? "Sólo se permiten números enteros.",

            blurMessage: config.blurMessage
                ?? InputHelper.getRangeMessage(min, max)
        });
    }

    static digits(field, options = {}) {
        const {
            min = null,
            max = null,
            maxLength = null,
            ...config
        } = options;

        return this.apply(field, {
            ...config,

            inputValidator(value) {
                if (!/^\d*$/.test(value)) {
                    return false;
                }

                if (
                    maxLength !== null
                    && value.length > Number(maxLength)
                ) {
                    return false;
                }

                return true;
            },

            blurValidator(value) {
                return InputHelper.validateRange(value, {
                    min,
                    max,
                    parser: Number
                });
            },

            message: config.message
                ?? (
                    maxLength !== null
                        ? `Sólo se permiten máximo ${maxLength} dígitos.`
                        : "Sólo se permiten dígitos."
                ),

            blurMessage: config.blurMessage
                ?? InputHelper.getRangeMessage(min, max)
        });
    }

    static decimal(field, options = {}) {
        const {
            min = null,
            max = null,
            decimals = null,
            allowNegative = true,
            decimalSeparator = ".",
            ...config
        } = options;

        const pattern = this.createDecimalPattern({
            decimals,
            allowNegative,
            decimalSeparator
        });

        return this.apply(field, {
            ...config,

            inputValidator(value) {
                return pattern.test(value);
            },

            blurValidator(value) {
                return InputHelper.validateRange(value, {
                    min,
                    max,
                    parser(currentValue) {
                        return InputHelper.parseDecimal(
                            currentValue,
                            decimalSeparator
                        );
                    }
                });
            },

            message: config.message
                ?? InputHelper.getDecimalMessage(
                    decimals,
                    allowNegative
                ),

            blurMessage: config.blurMessage
                ?? InputHelper.getRangeMessage(min, max)
        });
    }

    static currency(field, options = {}) {
        const {
            min = null,
            max = null,
            decimals = 2,
            allowNegative = false,
            decimalSeparator = ".",
            ...config
        } = options;

        return this.decimal(field, {
            ...config,
            min,
            max,
            decimals,
            allowNegative,
            decimalSeparator,
            message: config.message
                ?? `Sólo se permiten cantidades con máximo ${decimals} decimales.`
        });
    }

    static alphabetic(field, options = {}) {
        const {
            spaces = false,
            accents = true,
            ...config
        } = options;

        let characters = "A-Za-zÑñ";

        if (accents) {
            characters += "ÁÉÍÓÚÜáéíóúü";
        }

        if (spaces) {
            characters += "\\s";
        }

        const pattern = new RegExp(`^[${characters}]*$`);

        return this.apply(field, {
            ...config,

            inputValidator(value) {
                return pattern.test(value);
            },

            message: config.message
                ?? (
                    spaces
                        ? "Sólo se permiten caracteres alfabéticos y espacios."
                        : "Sólo se permiten caracteres alfabéticos."
                )
        });
    }

    static alphanumeric(field, options = {}) {
        const {
            spaces = false,
            accents = true,
            ...config
        } = options;

        let characters = "0-9A-Za-zÑñ";

        if (accents) {
            characters += "ÁÉÍÓÚÜáéíóúü";
        }

        if (spaces) {
            characters += "\\s";
        }

        const pattern = new RegExp(`^[${characters}]*$`);

        return this.apply(field, {
            ...config,

            inputValidator(value) {
                return pattern.test(value);
            },

            message: config.message
                ?? (
                    spaces
                        ? "Sólo se permiten caracteres alfanuméricos y espacios."
                        : "Sólo se permiten caracteres alfanuméricos."
                )
        });
    }

    static hexadecimal(field, options = {}) {
        const {
            maxLength = null,
            ...config
        } = options;

        return this.apply(field, {
            ...config,

            inputValidator(value) {
                if (!/^[0-9a-f]*$/i.test(value)) {
                    return false;
                }

                if (
                    maxLength !== null
                    && value.length > Number(maxLength)
                ) {
                    return false;
                }

                return true;
            },

            message: config.message
                ?? (
                    maxLength !== null
                        ? `Sólo se permiten máximo ${maxLength} caracteres hexadecimales.`
                        : "Sólo se permiten caracteres hexadecimales."
                )
        });
    }

    //-------------------------------------------------------------------------
    // Aplicación de reglas
    //-------------------------------------------------------------------------

    static apply(field, options = {}) {
        const config = {
            ...this.defaults,
            ...options
        };

        const $control = this.resolveControl(
            field,
            config.context
        );

        if (!$control.length) {
            console.warn(
                `InputHelper: no se encontró el control`,
                field
            );

            return $control;
        }

        $control.each(function () {
            const $input = $(this);

            InputHelper.bindInputValidation(
                $input,
                config
            );

            InputHelper.bindBlurValidation(
                $input,
                config
            );
        });

        return $control;
    }

    static bindInputValidation($input, config) {
        $input.off(".inputHelper");

        const input = $input[0];

        const state = {
            value: input.value ?? "",
            selectionStart: input.selectionStart,
            selectionEnd: input.selectionEnd,
            composing: false,
            lastToastAt: 0
        };

        $input.data("inputHelperState", state);

        $input.on(
            "compositionstart.inputHelper",
            function () {
                state.composing = true;
            }
        );

        $input.on(
            "compositionend.inputHelper",
            function () {
                state.composing = false;
                $(this).trigger("input");
            }
        );

        if (
            config.validateOnInput
            && typeof config.inputValidator === "function"
        ) {
            $input.on(
                "input.inputHelper",
                function () {
                    if (state.composing) {
                        return;
                    }

                    const value = this.value;

                    if (
                        InputHelper.isEmptyAllowed(
                            value,
                            config
                        )
                        || config.inputValidator(value, this)
                    ) {
                        InputHelper.saveState(
                            this,
                            state
                        );

                        InputHelper.clearError(this);

                        return;
                    }

                    InputHelper.restoreState(
                        this,
                        state
                    );

                    InputHelper.notify(
                        config.message,
                        state,
                        config
                    );
                }
            );
        }
    }

    static bindBlurValidation($input, config) {
        if (
            !config.validateOnBlur
            || typeof config.blurValidator !== "function"
        ) {
            return;
        }

        $input.on(
            "blur.inputHelper",
            function () {
                const value = this.value;
                const state = $input.data("inputHelperState");

                if (
                    InputHelper.isEmptyAllowed(
                        value,
                        config
                    )
                    || config.blurValidator(value, this)
                ) {
                    InputHelper.saveState(
                        this,
                        state
                    );

                    InputHelper.clearError(this);

                    return;
                }

                const message = config.blurMessage
                    || config.message;

                InputHelper.setError(
                    this,
                    message
                );

                InputHelper.notify(
                    message,
                    state,
                    config
                );

                if (config.clearOnBlurError) {
                    this.value = "";

                    InputHelper.saveState(
                        this,
                        state
                    );
                }
            }
        );
    }

    //-------------------------------------------------------------------------
    // Estado del control
    //-------------------------------------------------------------------------

    static saveState(input, state) {
        state.value = input.value;
        state.selectionStart = input.selectionStart;
        state.selectionEnd = input.selectionEnd;
    }

    static restoreState(input, state) {
        input.value = state.value;

        if (
            typeof input.setSelectionRange === "function"
            && state.selectionStart !== null
            && state.selectionEnd !== null
        ) {
            input.setSelectionRange(
                state.selectionStart,
                state.selectionEnd
            );
        }
    }

    //-------------------------------------------------------------------------
    // Validación
    //-------------------------------------------------------------------------

    static validateRange(
        value,
        {
            min = null,
            max = null,
            parser = Number
        } = {}
    ) {
        if (value === "") {
            return true;
        }

        const parsedValue = parser(value);

        if (!Number.isFinite(parsedValue)) {
            return false;
        }

        if (
            min !== null
            && min !== ""
            && parsedValue < Number(min)
        ) {
            return false;
        }

        if (
            max !== null
            && max !== ""
            && parsedValue > Number(max)
        ) {
            return false;
        }

        return true;
    }

    static isEmptyAllowed(value, config) {
        return config.allowEmpty && value === "";
    }

    static parseDecimal(value, decimalSeparator = ".") {
        const normalizedValue = decimalSeparator === ","
            ? value.replace(",", ".")
            : value;

        return Number(normalizedValue);
    }

    //-------------------------------------------------------------------------
    // Expresiones regulares
    //-------------------------------------------------------------------------

    static createDecimalPattern({
        decimals = null,
        allowNegative = true,
        decimalSeparator = "."
    } = {}) {
        const sign = allowNegative
            ? "-?"
            : "";

        const separator = decimalSeparator === ","
            ? ","
            : "\\.";

        const decimalPart = decimals === null
            ? `(?:${separator}\\d*)?`
            : `(?:${separator}\\d{0,${Number(decimals)}})?`;

        return new RegExp(
            `^${sign}\\d*${decimalPart}$`
        );
    }

    //-------------------------------------------------------------------------
    // Mensajes
    //-------------------------------------------------------------------------

    static getRangeMessage(min, max) {
        const hasMin = min !== null && min !== "";
        const hasMax = max !== null && max !== "";

        if (hasMin && hasMax) {
            return `El valor debe estar entre ${min} y ${max}.`;
        }

        if (hasMin) {
            return `El valor debe ser ${min} o mayor.`;
        }

        if (hasMax) {
            return `El valor debe ser ${max} o menor.`;
        }

        return null;
    }

    static getDecimalMessage(decimals, allowNegative) {
        const numberType = allowNegative
            ? "números decimales"
            : "números decimales positivos";

        if (decimals === null) {
            return `Sólo se permiten ${numberType}.`;
        }

        return `Sólo se permiten ${numberType} con máximo ${decimals} decimales.`;
    }

    //-------------------------------------------------------------------------
    // Errores y notificaciones
    //-------------------------------------------------------------------------

    static setError(input, message) {
        input.setCustomValidity(message || "");
        $(input).addClass("is-invalid");
    }

    static clearError(input) {
        input.setCustomValidity("");
        $(input).removeClass("is-invalid");
    }

    static notify(message, state, config) {
        if (
            !config.showToast
            || !message
            || typeof Toast === "undefined"
        ) {
            return;
        }

        const now = Date.now();

        if (
            now - state.lastToastAt
            < config.toastCooldown
        ) {
            return;
        }

        state.lastToastAt = now;

        Toast.fire({
            icon: "warning",
            title: message
        });
    }

    //-------------------------------------------------------------------------
    // Resolución del control
    //-------------------------------------------------------------------------

    static resolveControl(field, context = null) {
        if (field instanceof jQuery) {
            return field;
        }

        if (
            field instanceof HTMLElement
            || field instanceof NodeList
            || Array.isArray(field)
        ) {
            return $(field);
        }

        if (
            context
            && typeof context.getField === "function"
        ) {
            return context.getField(field);
        }

        return $(field);
    }

    //-------------------------------------------------------------------------
    // Eliminación de reglas
    //-------------------------------------------------------------------------

    static destroy(field, context = null) {
        const $control = this.resolveControl(
            field,
            context
        );

        $control
            .off(".inputHelper")
            .removeData("inputHelperState")
            .removeClass("is-invalid")
            .each(function () {
                this.setCustomValidity("");
            });

        return $control;
    }
}