class NumberHelper {
    //-------------------------------------------------------------------------
    // Configuración
    //-------------------------------------------------------------------------

    static defaults = {
        locale: "es-MX",
        decimals: 2,
        useGrouping: true,
        allowEmpty: true,
        formatOnBlur: true,
        unformatOnFocus: true
    };

    //-------------------------------------------------------------------------
    // Formateo general
    //-------------------------------------------------------------------------

    static format(value, options = {}) {
        const config = {
            ...this.defaults,
            ...options
        };

        const number = this.parse(value);

        if (number === null) {
            return config.allowEmpty ? "" : "0";
        }

        return new Intl.NumberFormat(
            config.locale,
            {
                minimumFractionDigits: config.decimals,
                maximumFractionDigits: config.decimals,
                useGrouping: config.useGrouping
            }
        ).format(number);
    }

    static currency(value, options = {}) {
        const config = {
            locale: "es-MX",
            currency: "MXN",
            decimals: 2,
            currencyDisplay: "symbol",
            ...options
        };

        const number = this.parse(value);

        if (number === null) {
            return "";
        }

        return new Intl.NumberFormat(
            config.locale,
            {
                style: "currency",
                currency: config.currency,
                currencyDisplay: config.currencyDisplay,
                minimumFractionDigits: config.decimals,
                maximumFractionDigits: config.decimals
            }
        ).format(number);
    }

    static percentage(value, options = {}) {
        const config = {
            locale: "es-MX",
            decimals: 2,
            normalized: false,
            ...options
        };

        const number = this.parse(value);

        if (number === null) {
            return "";
        }

        const normalizedValue = config.normalized
            ? number
            : number / 100;

        return new Intl.NumberFormat(
            config.locale,
            {
                style: "percent",
                minimumFractionDigits: config.decimals,
                maximumFractionDigits: config.decimals
            }
        ).format(normalizedValue);
    }

    //-------------------------------------------------------------------------
    // Conversión
    //-------------------------------------------------------------------------

    static parse(value) {
        if (
            value === null
            || value === undefined
            || value === ""
        ) {
            return null;
        }

        if (typeof value === "number") {
            return Number.isFinite(value)
                ? value
                : null;
        }

        let normalizedValue = String(value)
            .trim()
            .replace(/\s/g, "")
            .replace(/\$/g, "");

        const hasComma = normalizedValue.includes(",");
        const hasDot = normalizedValue.includes(".");

        /*
         * Formatos esperados:
         *
         * 1,234.56  -> 1234.56
         * 1.234,56  -> 1234.56
         * 1234,56   -> 1234.56
         * 1234.56   -> 1234.56
         */
        if (hasComma && hasDot) {
            const lastComma = normalizedValue.lastIndexOf(",");
            const lastDot = normalizedValue.lastIndexOf(".");

            if (lastComma > lastDot) {
                normalizedValue = normalizedValue
                    .replace(/\./g, "")
                    .replace(",", ".");
            } else {
                normalizedValue = normalizedValue
                    .replace(/,/g, "");
            }
        } else if (hasComma) {
            normalizedValue = normalizedValue.replace(",", ".");
        }

        const number = Number(normalizedValue);

        return Number.isFinite(number)
            ? number
            : null;
    }

    static unformat(value) {
        const number = this.parse(value);

        return number === null
            ? ""
            : String(number);
    }

    //-------------------------------------------------------------------------
    // Inputs
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
                "NumberHelper: no se encontró el control",
                field
            );

            return $control;
        }

        $control.each(function () {
            NumberHelper.bind($(this), config);
        });

        return $control;
    }

    static bind($input, config) {
        $input.off(".numberHelper");

        if (config.unformatOnFocus) {
            $input.on(
                "focus.numberHelper",
                function () {
                    const value = NumberHelper.unformat(
                        this.value
                    );

                    this.value = value;

                    /*
                     * Notificamos a InputHelper que el valor cambió
                     * programáticamente para actualizar su estado interno.
                     */
                    $(this).trigger("input");
                }
            );
        }

        if (config.formatOnBlur) {
            $input.on(
                "blur.numberHelper",
                function () {
                    if (this.value === "") {
                        return;
                    }

                    const number = NumberHelper.parse(
                        this.value
                    );

                    if (number === null) {
                        return;
                    }

                    this.value = NumberHelper.format(
                        number,
                        config
                    );
                }
            );
        }

        return $input;
    }

    static applyCurrency(field, options = {}) {
        const config = {
            locale: "es-MX",
            currency: "MXN",
            decimals: 2,
            formatOnBlur: true,
            unformatOnFocus: true,
            ...options
        };

        const $control = this.resolveControl(
            field,
            config.context
        );

        if (!$control.length) {
            console.warn(
                "NumberHelper: no se encontró el control",
                field
            );

            return $control;
        }

        $control.each(function () {
            const $input = $(this);

            $input.off(".numberHelper");

            if (config.unformatOnFocus) {
                $input.on(
                    "focus.numberHelper",
                    function () {
                        this.value = NumberHelper.unformat(
                            this.value
                        );

                        $(this).trigger("input");
                    }
                );
            }

            if (config.formatOnBlur) {
                $input.on(
                    "blur.numberHelper",
                    function () {
                        if (this.value === "") {
                            return;
                        }

                        const number = NumberHelper.parse(
                            this.value
                        );

                        if (number === null) {
                            return;
                        }

                        this.value = NumberHelper.currency(
                            number,
                            config
                        );
                    }
                );
            }
        });

        return $control;
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
    // Limpieza
    //-------------------------------------------------------------------------

    static destroy(field, context = null) {
        const $control = this.resolveControl(
            field,
            context
        );

        $control.off(".numberHelper");

        return $control;
    }
}