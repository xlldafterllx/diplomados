/**
 * Excepción personalizada para errores HTTP.
 *
 * Esta clase representa errores provenientes
 * de una petición HTTP realizada mediante HttpClient.
 */
class HttpException extends Error {

    constructor(message, options = {}) {

        super(message);

        this.name = "HttpException";

        this._status = options.status ?? 500;
        this._statusText = options.statusText ?? "";
        this._response = options.response ?? null;
        this._headers = options.headers ?? null;
        this._url = options.url ?? "";
        this._method = options.method ?? "";

        // Mantiene correctamente el stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HttpException);
        }

    }


    /**
     * Código HTTP recibido.
     *
     * Ejemplo:
     * 400, 401, 404, 500
     */
    get status() {
        return this._status;
    }


    /**
     * Texto asociado al código HTTP.
     *
     * Ejemplo:
     * "Unauthorized"
     */
    get statusText() {
        return this._statusText;
    }


    /**
     * Datos recibidos desde el servidor.
     *
     * Normalmente será el JSON de error.
     */
    get response() {
        return this._response;
    }


    /**
     * Headers HTTP de la respuesta.
     */
    get headers() {
        return this._headers;
    }


    /**
     * URL donde ocurrió el error.
     */
    get url() {
        return this._url;
    }


    /**
     * Método HTTP utilizado.
     *
     * Ejemplo:
     * GET, POST, PUT, DELETE
     */
    get method() {
        return this._method;
    }


    /**
     * Indica si el error pertenece
     * a HttpException.
     */
    get isHttpError() {
        return true;
    }
}