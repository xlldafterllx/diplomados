<?php
class ApiResponse
{
    private const HTTP_OK = 200;
    private const HTTP_CREATED = 201;
    private const HTTP_NO_CONTENT = 204;
    private const HTTP_BAD_REQUEST = 400;
    private const HTTP_UNAUTHORIZED = 401;
    private const HTTP_FORBIDDEN = 403;
    private const HTTP_NOT_FOUND = 404;
    private const HTTP_CONFLICT = 409;
    private const HTTP_UNPROCESSABLE_CONTENT = 422;
    private const HTTP_INTERNAL_SERVER_ERROR = 500;

    private static function send(array $options): void
    {
        $options = array_merge([
            "status" => self::HTTP_OK,
            "success" => true,
            "message" => null,
            "details" => null,
            "data" => null
        ], $options);

        http_response_code($options["status"]);
        header("Content-Type: application/json; charset=utf-8");

        $response = [
            "success" => $options["success"],
            "message" => $options["message"],
            "details" => $options["details"],
            "data" => $options["data"]
        ];

        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function success($data = null, ?string $message = "Operación realizada correctamente."): void
    {
        self::send([
            "message" => $message,
            "data" => $data
        ]);
    }

    public static function created($data = null, ?string $message = "Recurso creado correctamente."): void
    {
        self::send([
            "status" => self::HTTP_CREATED,
            "message" => $message,
            "data" => $data
        ]);
    }

    public static function noContent(): void
    {
        http_response_code(self::HTTP_NO_CONTENT);
        exit;
    }

    public static function badRequest(string $message, ?array $details = null): void
    {
        self::send([
            "status" => self::HTTP_BAD_REQUEST,
            "success" => false,
            "message" => $message,
            "details" => $details
        ]);
    }

    public static function unprocessableContent(string $message, ?array $details = null): void
    {
        self::send([
            "status" => self::HTTP_UNPROCESSABLE_CONTENT,
            "success" => false,
            "message" => $message,
            "details" => $details
        ]);
    }

    public static function unauthorized(string $message = "No autorizado.", ?string $details = null): void
    {
        self::send([
            "status" => self::HTTP_UNAUTHORIZED,
            "success" => false,
            "message" => $message,
            "details" => $details
        ]);
    }

    public static function forbidden(string $message = "Acceso denegado.", ?string $details = null): void
    {
        self::send([
            "status" => self::HTTP_FORBIDDEN,
            "success" => false,
            "message" => $message,
            "details" => $details
        ]);
    }

    public static function notFound(string $message = "Recurso no encontrado.", ?string $details = null): void
    {
        self::send([
            "status" => self::HTTP_NOT_FOUND,
            "success" => false,
            "message" => $message,
            "details" => $details
        ]);
    }

    public static function conflict(string $message = "Conflicto con el recurso.", ?array $details = null): void
    {
        self::send([
            "status" => self::HTTP_CONFLICT,
            "success" => false,
            "message" => $message,
            "details" => $details
        ]);
    }

    public static function serverError(string $message = "Error interno del servidor.", ?array $details = null): void
    {
        self::send([
            "status" => self::HTTP_INTERNAL_SERVER_ERROR,
            "success" => false,
            "message" => $message,
            "details" => $details
        ]);
    }
}