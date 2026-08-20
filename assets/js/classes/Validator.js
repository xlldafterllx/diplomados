class Validator {
    constructor() {
        this.component = null;
        this.rules = {};

        this.validationErrors = {};
        this.isValidated = false;

        /*this.messages = {
            required:
                "El campo :field es obligatorio.",

            requiredIf:
                "El campo :field es obligatorio cuando :other tenga uno de los siguientes valores: :values.",

            requiredUnless:
                "El campo :field es obligatorio, excepto cuando :other tenga uno de los siguientes valores: :values.",

            string:
                "El campo :field debe ser una cadena de texto.",

            integer:
                "El campo :field debe ser un número entero.",

            float:
                "El campo :field debe ser un número.",

            boolean:
                "El campo :field debe ser verdadero o falso.",

            array:
                "El campo :field debe ser un arreglo.",

            date:
                "El campo :field no contiene una fecha válida.",

            datetime:
                "El campo :field no contiene una fecha y hora válida.",

            email:
                "El campo :field debe ser un correo electrónico válido.",

            file:
                "El campo :field debe contener un archivo.",

            mimetype:
                "El archivo del campo :field no tiene un formato permitido.",

            maxFileSize:
                "El archivo del campo :field excede el tamaño permitido.",

            min:
                "El campo :field debe contener al menos :value caracteres.",

            max:
                "El campo :field no debe contener más de :value caracteres.",

            minValue:
                "El campo :field debe tener un valor mínimo de :value.",

            maxValue:
                "El campo :field debe tener un valor máximo de :value."
        };*/

        this.messages = {
            required:
                "Este campo es obligatorio.",

            requiredIf:
                "Este campo es obligatorio cuando ':other' tenga uno de los siguientes valores: :values.",

            requiredUnless:
                "Este campo es obligatorio, excepto cuando ':other' tenga uno de los siguientes valores: :values.",

            string:
                "Este campo debe ser una cadena de texto.",

            integer:
                "Este campo debe ser un número entero.",

            float:
                "Este campo debe ser un número.",

            boolean:
                "Este campo debe ser verdadero o falso.",

            array:
                "Este campo debe ser un arreglo.",

            date:
                "Este campo no contiene una fecha válida.",

            datetime:
                "Este campo no contiene una fecha y hora válida.",

            email:
                "Este campo debe ser un correo electrónico válido.",

            file:
                "Este campo debe contener un archivo.",

            mimetype:
                "El archivo no tiene un formato permitido.",

            maxFileSize:
                "El archivo excede el tamaño permitido.",

            min:
                "Este campo debe contener al menos :value caracteres.",

            max:
                "Este campo no debe contener más de :value caracteres.",

            minValue:
                "Este campo debe tener un valor mínimo de :value.",

            maxValue:
                "Este campo debe tener un valor máximo de :value."
        };
    }

    //-------------------------------------------------------------------------
    // Construction
    //-------------------------------------------------------------------------

    static make(component, rules) {
        const validator = new Validator();

        validator.component = component;
        validator.rules = rules;

        return validator;
    }

    //-------------------------------------------------------------------------
    // Results
    //-------------------------------------------------------------------------

    fails() {
        this.validate();

        return Object.keys(this.validationErrors).length > 0;
    }

    passes() {
        return !this.fails();
    }

    errors() {
        this.validate();

        return this.validationErrors;
    }

    firstError(field) {
        this.validate();

        return this.validationErrors[field]?.[0] ?? null;
    }

    validated() {
        this.validate();

        if (this.fails()) {
            return {};
        }

        const data = {};

        for (const field of Object.keys(this.rules)) {
            data[field] = this.value(field);
        }

        return data;
    }

    //-------------------------------------------------------------------------
    // Rules
    //-------------------------------------------------------------------------

    addRules(rules) {
        this.rules = {
            ...this.rules,
            ...rules
        };

        this.resetValidation();

        return this;
    }

    resetValidation() {
        this.isValidated = false;
        this.validationErrors = {};

        return this;
    }

    //-------------------------------------------------------------------------
    // Validation
    //-------------------------------------------------------------------------

    validate() {
        if (this.isValidated) {
            return;
        }

        this.isValidated = true;

        for (const [field, config] of Object.entries(this.rules)) {

            const $field = this.field(field);

            if (!$field.length) {
                console.warn(
                    `Validator: no se encontró el campo "${field}".`
                );

                continue;
            }

            /*
             * Si el campo está deshabilitado, no participa
             * en la validación del frontend.
             */
            if (this.isDisabled(field)) {
                continue;
            }

            const parsedRules = this.parseRules(
                config.rules ?? ""
            );

            const ruleNames = parsedRules.map(
                rule => rule.name
            );

            /*
             * Un campo nullable vacío no necesita ejecutar
             * el resto de sus reglas.
             */
            if (
                ruleNames.includes("nullable") &&
                this.skipEmpty(field)
            ) {
                continue;
            }

            for (const rule of parsedRules) {

                if (rule.name === "nullable") {
                    continue;
                }

                const method = this.validatorMethod(
                    rule.name
                );

                /*
                 * Igual que en PHP:
                 * ignoramos reglas desconocidas.
                 */
                if (!method) {
                    continue;
                }

                const valid = this[method](
                    field,
                    rule.parameter
                );

                /*
                 * Solo conservamos el primer error del campo.
                 */
                if (!valid) {
                    break;
                }
            }
        }
    }

    parseRules(rules) {
        if (!rules) {
            return [];
        }

        return String(rules)
            .split("|")
            .map(rule => {

                const [
                    name,
                    ...parameters
                ] = rule.split(":");

                return {
                    name: name.trim(),

                    parameter: parameters.length
                        ? parameters.join(":").trim()
                        : null
                };
            });
    }

    validatorMethod(rule) {
        const method =
            "validate" +
            rule.charAt(0).toUpperCase() +
            rule.slice(1);

        return typeof this[method] === "function"
            ? method
            : null;
    }

    //-------------------------------------------------------------------------
    // Fields
    //-------------------------------------------------------------------------

    field(field) {
        return this.component.getField(field);
    }

    fieldName(field) {
        return this.rules[field]?.name ?? field;
    }

    value(field) {
        const $field = this.field(field);

        if (!$field.length) {
            return null;
        }

        /*
         * File
         */
        if ($field.is(":file")) {
            return $field[0].files?.[0] ?? null;
        }

        /*
         * Radio group
         */
        if ($field.is(":radio")) {
            const $checked = $field.filter(":checked");

            return $checked.length
                ? $checked.val()
                : null;
        }

        /*
         * Checkbox
         */
        if ($field.is(":checkbox")) {

            if ($field.length > 1) {
                return $field
                    .filter(":checked")
                    .map(function () {
                        return $(this).val();
                    })
                    .get();
            }

            return $field.prop("checked");
        }

        /*
         * Select multiple
         */
        if ($field.is("select[multiple]")) {
            return $field.val() ?? [];
        }

        const value = $field.val();

        return typeof value === "string"
            ? value.trim()
            : value;
    }

    isDisabled(field) {
        const $field = this.field(field);

        return (
            $field.length > 0 &&
            $field.filter(":enabled").length === 0
        );
    }

    skipEmpty(field) {
        const value = this.value(field);

        if (value instanceof File) {
            return false;
        }

        if (Array.isArray(value)) {
            return value.length === 0;
        }

        return (
            value === null ||
            value === undefined ||
            String(value).trim() === ""
        );
    }

    //-------------------------------------------------------------------------
    // Errors
    //-------------------------------------------------------------------------

    addError(field, message) {
        if (!this.validationErrors[field]) {
            this.validationErrors[field] = [];
        }

        this.validationErrors[field].push(
            message
        );
    }

    fail(field, rule, replace = {}) {
        let message =
            this.messages[rule] ??
            "El campo :field es inválido.";

        const replacements = {
            ":field": this.fieldName(field),
            ...replace
        };

        for (
            const [search, value]
            of Object.entries(replacements)
        ) {
            message = message.replaceAll(
                search,
                String(value)
            );
        }

        this.addError(
            field,
            message
        );

        return false;
    }

    //-------------------------------------------------------------------------
    // Validators
    //-------------------------------------------------------------------------

    validateRequired(field) {
        const value = this.value(field);

        if (value instanceof File) {
            return true;
        }

        if (Array.isArray(value)) {
            return value.length > 0
                ? true
                : this.fail(field, "required");
        }

        if (
            value !== null &&
            value !== undefined &&
            String(value).trim() !== ""
        ) {
            return true;
        }

        return this.fail(
            field,
            "required"
        );
    }

    validateRequiredIf(field, parameter) {
        const condition =
            this.parseConditionalParameter(
                parameter
            );

        if (condition === null) {
            return true;
        }

        const otherValue =
            this.value(condition.field);

        const required =
            condition.values
                .map(String)
                .includes(
                    String(otherValue)
                );

        if (
            !required ||
            !this.skipEmpty(field)
        ) {
            return true;
        }

        return this.fail(
            field,
            "requiredIf",
            {
                ":other":
                    this.fieldName(
                        condition.field
                    ),

                ":values":
                    condition.values.join(", ")
            }
        );
    }

    validateRequiredUnless(field, parameter) {
        const condition =
            this.parseConditionalParameter(
                parameter
            );

        if (condition === null) {
            return true;
        }

        const otherValue =
            this.value(condition.field);

        const excludedValues =
            condition.values.map(String);

        if (
            excludedValues.includes(
                String(otherValue)
            )
        ) {
            return true;
        }

        if (!this.skipEmpty(field)) {
            return true;
        }

        return this.fail(
            field,
            "requiredUnless",
            {
                ":other":
                    this.fieldName(
                        condition.field
                    ),

                ":values":
                    condition.values.join(", ")
            }
        );
    }

    validateString(field) {
        if (this.skipEmpty(field)) {
            return true;
        }

        return typeof this.value(field) === "string"
            ? true
            : this.fail(field, "string");
    }

    validateInteger(field) {
        if (this.skipEmpty(field)) {
            return true;
        }

        const value = String(
            this.value(field)
        ).trim();

        return /^[-+]?\d+$/.test(value)
            ? true
            : this.fail(field, "integer");
    }

    validateFloat(field) {
        if (this.skipEmpty(field)) {
            return true;
        }

        return this.isNumeric(
            this.value(field)
        )
            ? true
            : this.fail(field, "float");
    }

    validateBoolean(field) {
        if (this.skipEmpty(field)) {
            return true;
        }

        const value = this.value(field);

        const validValues = [
            true,
            false,
            1,
            0,
            "1",
            "0",
            "true",
            "false"
        ];

        return validValues.includes(value)
            ? true
            : this.fail(field, "boolean");
    }

    validateArray(field) {
        if (this.skipEmpty(field)) {
            return true;
        }

        return Array.isArray(
            this.value(field)
        )
            ? true
            : this.fail(field, "array");
    }

    validateDate(field) {
        if (this.skipEmpty(field)) {
            return true;
        }

        const value = String(
            this.value(field)
        ).trim();

        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(value)
        ) {
            return this.fail(
                field,
                "date"
            );
        }

        const [year, month, day] =
            value
                .split("-")
                .map(Number);

        const date = new Date(
            year,
            month - 1,
            day
        );

        const valid =
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day;

        return valid
            ? true
            : this.fail(field, "date");
    }

    validateDatetime(field) {
        if (this.skipEmpty(field)) {
            return true;
        }

        const value = String(
            this.value(field)
        ).trim();

        const valid =
            !Number.isNaN(
                Date.parse(value)
            );

        return valid
            ? true
            : this.fail(field, "datetime");
    }

    validateEmail(field) {
        if (this.skipEmpty(field)) {
            return true;
        }

        const value = String(
            this.value(field)
        ).trim();

        const valid =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(value);

        return valid
            ? true
            : this.fail(field, "email");
    }

    validateFile(field) {
        if (this.skipEmpty(field)) {
            return true;
        }

        return this.value(field) instanceof File
            ? true
            : this.fail(field, "file");
    }

    validateMimetype(field, parameter) {
        if (this.skipEmpty(field)) {
            return true;
        }

        const file = this.value(field);

        if (!(file instanceof File)) {
            return this.fail(
                field,
                "mimetype"
            );
        }

        const allowed = String(
            parameter ?? ""
        )
            .split(",")
            .map(value => value.trim())
            .filter(Boolean);

        return allowed.includes(file.type)
            ? true
            : this.fail(
                field,
                "mimetype"
            );
    }

    validateMaxFileSize(field, parameter) {
        const file = this.value(field);

        if (!(file instanceof File)) {
            return true;
        }

        const maxSize = Number(parameter);

        if (!Number.isFinite(maxSize)) {
            return true;
        }

        return file.size <= maxSize
            ? true
            : this.fail(
                field,
                "maxFileSize"
            );
    }

    validateMin(field, parameter) {
        if (this.skipEmpty(field)) {
            return true;
        }

        if (
            !this.isNonNegativeInteger(
                parameter
            )
        ) {
            return true;
        }

        const value = this.value(field);

        if (
            typeof value === "string" &&
            value.length >= Number(parameter)
        ) {
            return true;
        }

        return this.fail(
            field,
            "min",
            {
                ":value": parameter
            }
        );
    }

    validateMax(field, parameter) {
        if (this.skipEmpty(field)) {
            return true;
        }

        if (
            !this.isNonNegativeInteger(
                parameter
            )
        ) {
            return true;
        }

        const value = this.value(field);

        if (
            typeof value === "string" &&
            value.length <= Number(parameter)
        ) {
            return true;
        }

        return this.fail(
            field,
            "max",
            {
                ":value": parameter
            }
        );
    }

    validateMinValue(field, parameter) {
        if (this.skipEmpty(field)) {
            return true;
        }

        const values =
            this.numericValues(
                field,
                parameter
            );

        if (
            values === null ||
            values[0] < values[1]
        ) {
            return this.fail(
                field,
                "minValue",
                {
                    ":value": parameter
                }
            );
        }

        return true;
    }

    validateMaxValue(field, parameter) {
        if (this.skipEmpty(field)) {
            return true;
        }

        const values =
            this.numericValues(
                field,
                parameter
            );

        if (
            values === null ||
            values[0] > values[1]
        ) {
            return this.fail(
                field,
                "maxValue",
                {
                    ":value": parameter
                }
            );
        }

        return true;
    }

    //-------------------------------------------------------------------------
    // Helpers
    //-------------------------------------------------------------------------

    isNonNegativeInteger(value) {
        return /^\d+$/.test(
            String(value)
        );
    }

    isNumeric(value) {
        if (
            value === null ||
            value === undefined ||
            String(value).trim() === ""
        ) {
            return false;
        }

        return Number.isFinite(
            Number(value)
        );
    }

    numericValues(field, parameter) {
        const value = this.value(field);

        if (
            !this.isNumeric(value) ||
            !this.isNumeric(parameter)
        ) {
            return null;
        }

        return [
            Number(value),
            Number(parameter)
        ];
    }

    parseConditionalParameter(parameter) {
        if (
            parameter === null ||
            String(parameter).trim() === ""
        ) {
            return null;
        }

        const parameters =
            String(parameter)
                .split(",")
                .map(value => value.trim());

        const field =
            parameters.shift();

        if (
            !field ||
            parameters.length === 0
        ) {
            return null;
        }

        return {
            field,
            values: parameters
        };
    }
}