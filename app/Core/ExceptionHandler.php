<?php
class ExceptionHandler
{
    public static function register(): void
    {
        set_exception_handler(
            [
                self::class,
                "handleException"
            ]
        );

        set_error_handler(
            [
                self::class,
                "handleError"
            ]
        );
    }

    public static function handleException(Throwable $exception): void
    {
        http_response_code(500);
        ApiResponse::serverError("Ha ocurrido un error interno.", self::details($exception));
    }

    public static function handleError(int $severity, string $message, string $file, int $line): bool
    {
        throw new ErrorException(
            $message,
            0,
            $severity,
            $file,
            $line
        );
    }

    private static function details(Throwable $exception): ?array
    {
        if (!Config::get("app.development")) {
            return null;
        }

        $details = array(
            "message" => $exception->getMessage(),
            "file" => $exception->getFile(),
            "line" => $exception->getLine()
        );

        if ($exception instanceof DatabaseException) {
            $details["database"] = [
                "sql" => $exception->sql(),
                "parameters" => $exception->parameters(),
                "interpolated_sql" => $exception->interpolatedSql()
            ];
        }

        return $details;
    }
}