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
            throw new Error("SelectHelper.load requiere una URL.");
        }

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
            console.error("Error al cargar las opciones del select:", error);

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

        const control = this.getControl(element, settings.context);
        const parent = this.getParent(
            element,
            settings.context,
            settings.dropdownParent
        );

        if (!control.length) {
            console.warn(
                `SelectHelper: no se encontró el control "${element}".`
            );

            return control;
        }

        /*
         * Creamos una copia para no modificar el arreglo original.
         *
         * Esto es especialmente importante cuando se utilizan constantes
         * como simpleAnswer en más de un select.
         */
        const selectData = Array.isArray(data)
            ? data.map(option => ({ ...option }))
            : [];

        if (settings.allOption) {
            selectData.unshift({
                id: 0,
                text: "TODAS"
            });
        }

        /*
         * Si el select ya fue inicializado, destruimos Select2 antes de
         * reconstruirlo.
         */
        if (control.hasClass("select2-hidden-accessible")) {
            control.select2("destroy");
        }

        control.empty();

        /*
         * Select2 necesita una opción vacía para mostrar correctamente
         * el placeholder en selects simples.
         */
        if (settings.placeholder) {
            control.append(new Option("", "", false, false));
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

        const defaultValue = this.resolveDefaultValue(
            settings.defaultValue,
            selectData
        );

        /*
         * Solamente asignamos un valor cuando realmente fue especificado.
         * Así no eliminamos accidentalmente una selección incluida en data.
         */
        if (defaultValue !== null && defaultValue !== "") {
            control.val(defaultValue);
        } else {
            control.val(null);
        }

        if (settings.triggerChange) {
            control.trigger("change");
        } else {
            control.trigger("change.select2");
        }

        return control;
    }

    //-------------------------------------------------------------------------
    // Métodos auxiliares
    //-------------------------------------------------------------------------

    /**
     * Obtiene el select desde ComponentHelper o mediante su id.
     */
    static getControl(element, context) {
        if (context) {
            return context.getField(element);
        }

        return $(`#${element}`);
    }

    /**
     * Obtiene el contenedor que utilizará dropdownParent.
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