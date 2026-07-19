<?php

class View
{
    private const BASE_PATH = APP_PATH . "/views/";

    public static function render(string $view): string
    {
        self::validate($view);

        $path = self::BASE_PATH . $view . ".php";

        if (!file_exists($path)) {
            throw new RuntimeException(
                "La vista '{$view}' no existe."
            );
        }

        ob_start();

        require $path;

        return ob_get_clean();
    }


    private static function validate(string $view): void
    {
        if (
            !preg_match(
                '/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/',
                $view
            )
        ) {
            throw new RuntimeException(
                "El nombre de la vista es inválido."
            );
        }
    }
}