class HttpClient {
    /*=========================================
     =            Configuración               =
     =========================================*/

    static config = {
        baseUrl: "",
        headers: {
            Accept: "application/json"
        },
        credentials: "same-origin"
    };

    /*==============================================
     =  Parsers para interpretar respuestas HTTP.  =
     ==============================================*/

    static responseParsers = [
        {
            match: contentType =>
                contentType.includes("application/json"),
            parse: response =>
                response.json()
        },
        {
            match: contentType =>
                contentType.startsWith("text/"),
            parse: response =>
                response.text()
        },
        {
            match: contentType =>
                contentType.startsWith("image/"),
            parse: response =>
                response.blob()
        },
        {
            match: contentType =>
                contentType.includes("application/pdf"),
            parse: response =>
                response.blob()
        }
    ];
    /*=========================================
     =            Eventos                     =
     =========================================*/

    static events = {
        requestStart: null,
        requestEnd: null,
        requestError: null
    };

    /*=========================================
     =            Métodos públicos            =
     =========================================*/

    static async get(url, options = {}) {
        return this.#request("GET", url, null, options);
    }

    static async post(url, data = null, options = {}) {
        return this.#request("POST", url, data, options);
    }

    static async put(url, data = null, options = {}) {
        return this.#request("PUT", url, data, options);
    }

    static async delete(url, data = null, options = {}) {
        return this.#request("DELETE", url, data, options);
    }

    /*=========================================
     =            Métodos privados            =
     =========================================*/

    static async #request(method, url, data = null, options = {}) {
        const requestUrl = this.config.baseUrl + url;

        try {
            const hasFiles = this.#containsFiles(data);
            const body = this.#buildBody(data, hasFiles);
            const headers = this.#buildHeaders(
                hasFiles,
                options.headers
            );

            const fetchOptions = {
                method,
                headers,
                body,
                credentials: this.config.credentials,
                signal: options.signal
            };

            if (body === null) {
                delete fetchOptions.body;
            }

            const response = await fetch(
                requestUrl,
                fetchOptions
            );

            const result = await this.#parseResponse(response);

            if (!response.ok) {
                this.#handleError(
                    response,
                    result,
                    requestUrl,
                    method
                );
            }
            return result;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                error.message || "Ocurrió un error inesperado.",
                {
                    status: 0,
                    statusText: "",
                    response: null,
                    url: requestUrl,
                    method
                }
            );
        }
    }

    static #buildUrl(url) {
        return this.config.baseUrl.replace(/\/$/, "") +
            "/" +
            url.replace(/^\//, "");
    }

    static #buildHeaders(isMultipart, customHeaders = {}) {
        const headers = {
            ...this.config.headers,
            ...customHeaders
        };

        if (!isMultipart) {
            headers["Content-Type"] = "application/json";
        }

        return headers;
    }

    static #buildBody(data, isMultipart) {
        if (data == null) {
            return null;
        }

        return isMultipart
            ? this.#objectToFormData(data)
            : JSON.stringify(data);
    }

    static #containsFiles(value) {
        if (
            value instanceof File ||
            value instanceof Blob ||
            value instanceof FileList
        ) {
            return true;
        }

        if (Array.isArray(value)) {
            return value.some(item => this.#containsFiles(item));
        }

        if (value && typeof value === "object") {
            return Object.values(value)
                .some(item => this.#containsFiles(item));
        }

        return false;
    }

    static #objectToFormData(value, formData = new FormData(), parentKey = "") {
        if (value == null) {
            return formData;
        }

        for (const [key, item] of Object.entries(value)) {
            const field = parentKey
                ? `${parentKey}[${key}]`
                : key;

            if (item == null) {
                continue;
            }

            if (item instanceof File || item instanceof Blob) {
                formData.append(field, item);
                continue;
            }

            if (item instanceof FileList) {
                Array.from(item).forEach(file => {
                    formData.append(`${field}[]`, file);
                });

                continue;
            }

            if (Array.isArray(item)) {
                item.forEach((element, index) => {
                    if (
                        element instanceof File ||
                        element instanceof Blob
                    ) {
                        formData.append(`${field}[]`, element);
                    } else if (element && typeof element === "object") {
                        this.#objectToFormData(
                            element,
                            formData,
                            `${field}[${index}]`
                        );
                    } else {
                        formData.append(`${field}[]`, element);
                    }

                });
                continue;
            }

            if (
                item &&
                typeof item === "object"
            ) {
                this.#objectToFormData(
                    item,
                    formData,
                    field
                );

                continue;
            }

            formData.append(field, item);
        }

        return formData;
    }

    static async #parseResponse(response) {
        if (response.status === 204) {
            return null;
        }

        const contentType = response.headers.get("Content-Type") || "";

        for (const parser of this.responseParsers) {
            if (parser.match(contentType)) {
                return await parser.parse(response);
            }
        }

        return await response.blob();
    }

    static #handleError(response, result) {
        throw new HttpException(
            result?.message ||
            result?.error ||
            response.statusText ||
            "Error inesperado.",
            {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                response: result
            }
        );
    }
}