class SelectHelper {
    //-------------------------------------------------------------------------
    // Carga remota
    //-------------------------------------------------------------------------

    /**
     * Obtiene las opciones desde un endpoint e inicializa el select.
     *
     * @param {string} element
     * @param {object} request
     * @param {object} options
     * @returns {Promise<Array>}
     */
    static async load(element, request, options = {}) {
        const {
            url,
            action,
            parameters = {}
        } = request;

        if (!url) {
            throw new Error(
                "SelectHelper.load requiere una URL."
            );
        }

        /*
         * Permite inicializar el select sin realizar una petición
         * cuando no se proporciona una acción.
         */
        if (!action) {
            return this.fill(element, [], options);
        }

        try {
            const result = await HttpClient.post(url, {
                action,
                parameters
            });

            const data = Array.isArray(result.data)
                ? result.data
                : [];

            this.fill(element, data, options);

            return data;
        } catch (error) {
            console.error(
                "Error al cargar las opciones del select:",
                error
            );

            Toast.fire({
                icon: "error",
                title: "Ocurrió un error",
                html: error.message
            });

            throw error;
        }
    }

    //-------------------------------------------------------------------------
    // Inicialización con datos existentes
    //-------------------------------------------------------------------------

    /**
     * Inicializa un select con opciones locales.
     *
     * @param {string} element
     * @param {Array} data
     * @param {object} options
     * @returns {JQuery}
     */
    static fill(element, data = [], options = {}) {
        const settings = {
            context: null,
            placeholder: "Selecciona una opción",
            defaultValue: null,
            allOption: false,
            clearOption: false,
            triggerChange: true,
            dropdownParent: null,
            closeOnSelect: true,
            ...options
        };

        const control = this.getControl(
            element,
            settings.context
        );

        if (!control.length) {
            console.warn(
                `SelectHelper: no se encontró el control "${element}".`
            );

            return control;
        }

        const isMultiple = control.prop("multiple");

        const parent = this.getParent(
            element,
            settings.context,
            settings.dropdownParent
        );

        /*
         * Creamos una copia para no modificar el arreglo original.
         *
         * Esto es especialmente importante cuando se utilizan constantes
         * como simpleAnswer en más de un select.
         */
        const selectData = Array.isArray(data)
            ? data.map(option => ({ ...option }))
            : [];

        /*
         * Agrega la opción general "TODAS".
         *
         * En selects simples funciona como una opción normal.
         * En selects múltiples tendrá un comportamiento excluyente.
         */
        if (settings.allOption) {
            selectData.unshift({
                id: 0,
                text: "TODAS"
            });
        }

        /*
         * Eliminamos únicamente los eventos registrados por este helper.
         *
         * Esto evita que el comportamiento se registre varias veces
         * cuando fill() se ejecuta nuevamente sobre el mismo select.
         */
        control.off(".selectHelperAllOption");

        /*
         * Si el select ya fue inicializado, destruimos Select2 antes
         * de reconstruirlo.
         */
        if (control.hasClass("select2-hidden-accessible")) {
            control.select2("destroy");
        }

        control.empty();

        /*
         * Select2 necesita una opción vacía para mostrar correctamente
         * el placeholder en selects simples.
         *
         * Los selects múltiples no necesitan esta opción vacía.
         */
        if (settings.placeholder && !isMultiple) {
            control.append(
                new Option("", "", false, false)
            );
        }

        control.select2({
            theme: "bootstrap-5",
            width: "100%",
            dropdownParent: parent,
            placeholder: settings.placeholder,
            allowClear: settings.clearOption,
            language: "es",
            closeOnSelect: settings.closeOnSelect,
            data: selectData
        });

        /*
         * El comportamiento excluyente solo se registra cuando:
         *
         * 1. El select permite múltiples valores.
         * 2. Se activó allOption.
         */
        if (isMultiple && settings.allOption) {
            this.bindMultiAllOptionBehavior(control);
        }

        const defaultValue = this.resolveDefaultValue(
            settings.defaultValue,
            selectData
        );

        /*
         * Solamente asignamos un valor cuando realmente fue especificado.
         *
         * Así no eliminamos accidentalmente una selección incluida
         * en los datos.
         */
        if (defaultValue !== null && defaultValue !== "") {
            control.val(defaultValue);
        } else {
            control.val(null);
        }

        /*
         * change ejecuta también los listeners externos del select.
         *
         * change.select2 solamente actualiza visualmente el componente,
         * sin ejecutar el resto de los listeners.
         */
        if (settings.triggerChange) {
            control.trigger("change");
        } else {
            control.trigger("change.select2");
        }

        return control;
    }

    //-------------------------------------------------------------------------
    // Comportamiento de selects múltiples
    //-------------------------------------------------------------------------

    /**
     * Hace que la opción agregada mediante allOption sea excluyente
     * cuando el select permite múltiples valores.
     *
     * Si se selecciona "TODAS", se eliminan las demás selecciones.
     *
     * Si "TODAS" ya estaba seleccionada y se elige otra opción,
     * se deselecciona "TODAS".
     *
     * @param {JQuery} control
     */
    static bindMultiAllOptionBehavior(control) {
        control.on(
            "select2:selecting.selectHelperAllOption",
            function (event) {
                const selectedValue = String(
                    event.params.args.data.id
                );

                /*
                 * Si se selecciona "TODAS", dejamos únicamente
                 * la opción con value 0.
                 */
                if (selectedValue === "0") {
                    control
                        .val(["0"])
                        .trigger("change");

                    return;
                }

                /*
                 * Si se selecciona cualquier otra opción,
                 * revisamos si "TODAS" estaba seleccionada.
                 */
                const allOption = control.find(
                    'option[value="0"]'
                );

                if (allOption.prop("selected")) {
                    /*
                     * Deseleccionamos "TODAS".
                     *
                     * La nueva opción será seleccionada normalmente por
                     * Select2 después de finalizar select2:selecting.
                     */
                    allOption.prop("selected", false);
                    control.trigger("change");
                }
            }
        );
    }

    //-------------------------------------------------------------------------
    // Métodos auxiliares
    //-------------------------------------------------------------------------

    /**
     * Obtiene el select desde ComponentHelper o mediante su id.
     *
     * @param {string} element
     * @param {ComponentHelper|null} context
     * @returns {JQuery}
     */
    static getControl(element, context) {
        if (context) {
            return context.getField(element);
        }

        return $(`#${element}`);
    }

    /**
     * Obtiene el contenedor que utilizará dropdownParent.
     *
     * @param {string} element
     * @param {ComponentHelper|null} context
     * @param {string|JQuery|null} dropdownParent
     * @returns {JQuery|null}
     */
    static getParent(element, context, dropdownParent) {
        if (dropdownParent) {
            return dropdownParent instanceof jQuery
                ? dropdownParent
                : $(dropdownParent);
        }

        if (context) {
            const parent = context.getContainer(element);

            return parent?.length
                ? parent
                : null;
        }

        return null;
    }

    /**
     * Interpreta valores especiales como "first" y "last".
     *
     * @param {*} defaultValue
     * @param {Array} data
     * @returns {*}
     */
    static resolveDefaultValue(defaultValue, data) {
        if (!data.length) {
            return null;
        }

        switch (defaultValue) {
            case "first":
                return data[0].id;

            case "last":
                return data[data.length - 1].id;

            default:
                return defaultValue;
        }
    }
}