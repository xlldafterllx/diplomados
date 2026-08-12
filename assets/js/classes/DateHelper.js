class DateHelper {
    //-------------------------------------------------------------------------
    // Static properties
    //-------------------------------------------------------------------------

    static defaults = {
        locale: "es",
        allowInput: true,
        disableMobile: true
    };

    //-------------------------------------------------------------------------
    // Initializers
    //-------------------------------------------------------------------------

    static date(element, options = {}) {
        const {
            context = null,
            minDate = null,
            maxDate = null,
            defaultDate = null,
            placeholder = "dd/mm/aaaa",
            todayButton = true,
            clearButton = false,
            onChange = null,
            ...customOptions
        } = options;

        const plugins = this.getShortcutPlugins({
            todayButton,
            clearButton,
            type: "date"
        });

        return this.create(
            element,
            {
                altInput: true,
                altInputClass: "form-control",
                altFormat: "d/m/Y",
                dateFormat: "Y-m-d",

                minDate,
                maxDate,
                defaultDate,
                placeholder,

                plugins,
                onChange,

                ...customOptions
            },
            context
        );
    }

    static time(element, options = {}) {
        const {
            context = null,
            minTime = null,
            maxTime = null,
            defaultDate = null,
            minuteIncrement = 15,
            placeholder = "hh:mm",
            nowButton = false,
            clearButton = false,
            onChange = null,
            ...customOptions
        } = options;

        const plugins = this.getShortcutPlugins({
            nowButton,
            clearButton,
            type: "time"
        });

        return this.create(
            element,
            {
                enableTime: true,
                noCalendar: true,
                time_24hr: false,

                altInput: true,
                altFormat: "H:i",
                dateFormat: "h:i K",

                minuteIncrement,

                minTime,
                maxTime,
                defaultDate,
                placeholder,

                plugins,
                onChange,

                ...customOptions
            },
            context
        );
    }

    static datetime(element, options = {}) {
        const {
            context = null,
            minDate = null,
            maxDate = null,
            minTime = null,
            maxTime = null,
            defaultDate = null,
            minuteIncrement = 15,
            placeholder = "dd/mm/aaaa hh:mm",
            nowButton = true,
            clearButton = false,
            onChange = null,
            ...customOptions
        } = options;

        const plugins = this.getShortcutPlugins({
            nowButton,
            clearButton,
            type: "datetime"
        });

        return this.create(
            element,
            {
                enableTime: true,
                time_24hr: true,

                altInput: true,
                altInputClass: "form-control",
                altFormat: "d/m/Y h:i K",
                dateFormat: "Y-m-d H:i",

                minuteIncrement,

                minDate,
                maxDate,
                minTime,
                maxTime,
                defaultDate,
                placeholder,

                plugins,
                onChange,

                ...customOptions
            },
            context
        );
    }

    static month(element, options = {}) {
        const {
            context = null,
            minDate = null,
            maxDate = null,
            defaultDate = null,
            placeholder = "Mes aaaa",
            currentMonthButton = true,
            clearButton = false,
            onChange = null,
            ...customOptions
        } = options;

        this.validatePlugin(
            "monthSelectPlugin",
            "El plugin monthSelectPlugin no está disponible."
        );

        const plugins = [
            new monthSelectPlugin({
                shorthand: false,
                dateFormat: "Y-m",
                altFormat: "F Y"
            }),

            ...this.getShortcutPlugins({
                currentMonthButton,
                clearButton,
                type: "month"
            })
        ];

        return this.create(
            element,
            {
                altInput: true,
                altInputClass: "form-control",

                minDate,
                maxDate,
                defaultDate,
                placeholder,

                plugins,
                onChange,

                ...customOptions
            },
            context
        );
    }

    //-------------------------------------------------------------------------
    // Events
    //-------------------------------------------------------------------------

    static on(element, event, callback, context = null) {
        const instance = this.getInstance(element, context);

        if (instance) {

            const hook = this.getHookName(event);

            if (!hook) {
                throw new Error(
                    `Evento "${event}" no soportado.`
                );
            }

            instance.config[hook].push(callback);

            return;
        }

        context
            ? context.getField(element).on(event, callback)
            : $("#" + element).on(event, callback);
    }

    static getHookName(event) {
        const hooks = {
            change: "onChange",
            open: "onOpen",
            close: "onClose",
            ready: "onReady",
            monthChange: "onMonthChange",
            yearChange: "onYearChange",
            valueUpdate: "onValueUpdate"
        };

        return hooks[event] ?? null;
    }

    //-------------------------------------------------------------------------
    // Instance management
    //-------------------------------------------------------------------------

    static create(element, options = {}, context = null) {
        this.validateFlatpickr();

        const control = this.getElement(element, context);

        if (!control) {
            throw new Error(
                `No se encontró el control "${element}".`
            );
        }

        this.destroy(control);

        const {
            placeholder = "",
            onReady = null,
            onChange = null,
            ...flatpickrOptions
        } = options;

        control.placeholder = placeholder;

        const config = this.cleanOptions({
            ...this.defaults,
            ...flatpickrOptions,

            onReady: [
                function (selectedDates, dateString, instance) {
                    const visibleInput = instance.altInput ?? instance.input;

                    visibleInput.placeholder = placeholder;
                },

                ...this.normalizeHooks(onReady)
            ],

            onChange: [
                function (selectedDates, dateString, instance) {
                    const visibleInput = instance.altInput ?? instance.input;

                    $(visibleInput).removeClass("is-invalid");
                },

                ...this.normalizeHooks(onChange)
            ]
        });

        return flatpickr(control, config);
    }

    static getInstance(element, context = null) {
        const control = this.getElement(element, context);

        return control?._flatpickr ?? null;
    }

    static destroy(element, context = null) {
        const control = this.getElement(element, context);

        if (control?._flatpickr) {
            control._flatpickr.destroy();
        }
    }

    static normalizeHooks(hook) {
        if (!hook) {
            return [];
        }

        return Array.isArray(hook)
            ? hook
            : [hook];
    }

    //-------------------------------------------------------------------------
    // Value management
    //-------------------------------------------------------------------------

    static setDate(
        element,
        value,
        context = null,
        triggerChange = true,
        format = null
    ) {
        const instance = this.getInstance(element, context);

        if (!instance) {
            return;
        }

        if (format) {
            instance.setDate(value, triggerChange, format);
            return;
        }

        instance.setDate(value, triggerChange);
    }

    static getDate(element, context = null) {
        const instance = this.getInstance(element, context);

        return instance?.selectedDates?.[0] ?? null;
    }

    static getValue(element, context = null) {
        const control = this.getElement(element, context);

        return control?.value ?? null;
    }

    static clear(element, context = null, triggerChange = true) {
        const instance = this.getInstance(element, context);

        if (!instance) {
            return;
        }

        instance.clear();

        if (triggerChange) {
            instance.input.dispatchEvent(
                new Event("change", {
                    bubbles: true
                })
            );
        }
    }

    static open(element, context = null) {
        this.getInstance(element, context)?.open();
    }

    static close(element, context = null) {
        this.getInstance(element, context)?.close();
    }

    //-------------------------------------------------------------------------
    // Dynamic limits
    //-------------------------------------------------------------------------

    static setMinDate(element, value, context = null) {
        this.getInstance(element, context)?.set(
            "minDate",
            value || null
        );
    }

    static setMaxDate(element, value, context = null) {
        this.getInstance(element, context)?.set(
            "maxDate",
            value || null
        );
    }

    static setMinTime(element, value, context = null) {
        this.getInstance(element, context)?.set(
            "minTime",
            value || null
        );
    }

    static setMaxTime(element, value, context = null) {
        this.getInstance(element, context)?.set(
            "maxTime",
            value || null
        );
    }

    //-------------------------------------------------------------------------
    // Formatting
    //-------------------------------------------------------------------------

    static parse(value, format = "Y-m-d") {
        if (!value) {
            return null;
        }

        this.validateFlatpickr();

        return flatpickr.parseDate(value, format);
    }

    static format(value, format = "d/m/Y") {
        if (!value) {
            return "";
        }

        this.validateFlatpickr();

        const date = value instanceof Date
            ? value
            : new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return flatpickr.formatDate(date, format);
    }

    //-------------------------------------------------------------------------
    // Shortcut buttons
    //-------------------------------------------------------------------------

    static getShortcutPlugins(options = {}) {
        const {
            todayButton = false,
            nowButton = false,
            currentMonthButton = false,
            clearButton = false,
            type = "date"
        } = options;

        const buttons = [];
        const callbacks = [];

        if (todayButton) {
            buttons.push({
                label: "Hoy",
                attributes: {
                    class: "btn btn-sm btn-outline-secondary"
                }
            });

            callbacks.push((index, instance) => {
                instance.setDate(
                    new Date(),
                    true
                );

                instance.close();
            });
        }

        if (nowButton) {
            buttons.push({
                label: "Ahora",
                attributes: {
                    class: "btn btn-sm btn-outline-secondary"
                }
            });

            callbacks.push((index, instance) => {
                const now = new Date();

                if (type === "time") {
                    instance.setDate(
                        now,
                        true
                    );
                } else {
                    instance.setDate(
                        now,
                        true
                    );
                }

                instance.close();
            });
        }

        if (currentMonthButton) {
            buttons.push({
                label: "Mes actual",
                attributes: {
                    class: "btn btn-sm btn-outline-secondary"
                }
            });

            callbacks.push((index, instance) => {
                const today = new Date();

                const currentMonth = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    1
                );

                instance.setDate(
                    currentMonth,
                    true
                );

                instance.close();
            });
        }

        if (clearButton) {
            buttons.push({
                label: "Limpiar",
                attributes: {
                    class: "btn btn-sm btn-outline-secondary"
                }
            });

            callbacks.push((index, instance) => {
                instance.clear();
                instance.close();

                instance.input.dispatchEvent(
                    new Event("change", {
                        bubbles: true
                    })
                );
            });
        }

        if (buttons.length === 0) {
            return [];
        }

        this.validatePlugin(
            "ShortcutButtonsPlugin",
            "El plugin ShortcutButtonsPlugin no está disponible."
        );

        return [
            new ShortcutButtonsPlugin({
                button: buttons,
                onClick: callbacks
            })
        ];
    }

    //-------------------------------------------------------------------------
    // Element resolution
    //-------------------------------------------------------------------------

    static getElement(element, context = null) {
        if (element instanceof HTMLElement) {
            return element;
        }

        if (element instanceof jQuery) {
            return element[0] ?? null;
        }

        if (context) {
            const control = context.getField(element);

            return control?.[0] ?? null;
        }

        if (typeof element === "string") {
            if (
                element.startsWith("#") ||
                element.startsWith(".") ||
                element.startsWith("[")
            ) {
                return document.querySelector(element);
            }

            return document.getElementById(element);
        }

        return null;
    }

    //-------------------------------------------------------------------------
    // Utilities
    //-------------------------------------------------------------------------

    static cleanOptions(options) {
        return Object.fromEntries(
            Object.entries(options).filter(
                ([, value]) => value !== null && value !== undefined
            )
        );
    }

    static validateFlatpickr() {
        if (typeof flatpickr === "undefined") {
            throw new Error(
                "Flatpickr no está disponible. Verifica el orden de los assets."
            );
        }
    }

    static validatePlugin(plugin, message) {
        if (typeof window[plugin] === "undefined") {
            throw new Error(message);
        }
    }

    static getDayName(element, context = null, format = "long") {
        const date = this.getDate(element, context);

        if (!date) {
            return "";
        }

        return date.toLocaleDateString("es-MX", {
            weekday: format
        });
    }
}