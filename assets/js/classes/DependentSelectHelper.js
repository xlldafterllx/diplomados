class DependentSelectHelper {
    /**
     * Carga varios selects dependientes.
     *
     * @param {object} config
     * @returns {Promise<Array>}
     */
    static async load(config = {}) {
        const {
            context,
            dependencies = {},
            url,
            parameters = {},
            selectedValues = {},
            selectOptions = {}
        } = config;

        this.validateConfig({
            context,
            dependencies,
            url
        });

        return Promise.all(
            Object.entries(dependencies).map(
                ([element, dependency]) => {
                    const dependencyConfig =
                        this.normalizeDependency(dependency);

                    return SelectHelper.load(
                        element,
                        {
                            url,
                            action: dependencyConfig.action,
                            parameters: {
                                ...parameters,
                                ...dependencyConfig.parameters
                            }
                        },
                        {
                            context,
                            clearOption: true,
                            triggerChange: false,
                            ...selectOptions,
                            defaultValue:
                                selectedValues[element]
                                ?? dependencyConfig.defaultValue
                                ?? null
                        }
                    );
                }
            )
        );
    }

    /**
     * Limpia e inicializa los selects dependientes.
     *
     * @param {object} config
     */
    static clear(config = {}) {
        const {
            context,
            dependencies = {},
            selectOptions = {}
        } = config;

        if (!context) {
            throw new Error(
                "DependentSelectHelper.clear requiere un contexto."
            );
        }

        Object.keys(dependencies).forEach(element => {
            SelectHelper.fill(
                element,
                [],
                {
                    context,
                    clearOption: true,
                    triggerChange: false,
                    ...selectOptions,
                    defaultValue: null
                }
            );
        });
    }

    /**
     * Carga o limpia los dependientes según exista el valor padre.
     *
     * @param {object} config
     * @returns {Promise<Array>}
     */
    static async sync(config = {}) {
        const {
            parentValue
        } = config;

        if (
            parentValue === null ||
            parentValue === undefined ||
            parentValue === ""
        ) {
            this.clear(config);
            return [];
        }

        return this.load(config);
    }

    /**
     * Permite declarar una dependencia como cadena u objeto.
     */
    static normalizeDependency(dependency) {
        if (typeof dependency === "string") {
            return {
                action: dependency,
                parameters: {},
                defaultValue: null
            };
        }

        return {
            action: dependency.action,
            parameters: dependency.parameters ?? {},
            defaultValue: dependency.defaultValue ?? null
        };
    }

    static validateConfig({ context, dependencies, url }) {
        if (!context) {
            throw new Error(
                "DependentSelectHelper.load requiere un contexto."
            );
        }

        if (!url) {
            throw new Error(
                "DependentSelectHelper.load requiere una URL."
            );
        }

        if (
            !dependencies ||
            typeof dependencies !== "object" ||
            !Object.keys(dependencies).length
        ) {
            throw new Error(
                "DependentSelectHelper.load requiere dependencias."
            );
        }
    }
}