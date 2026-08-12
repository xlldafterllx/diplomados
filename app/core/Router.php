<?php
class Router
{
    public static function resolve(): void
    {
        $route = self::getRoute();

        if (Session::has("auth.id")) {
            if (empty($route))
                $route = Config::get("app.home");
        } else {
            echo '<script>history.replaceState({}, "", "' . BASE_URL . '");</script>';
            $route = "login";
        }

        /*$route = Session::has("auth.id")
            ? empty($route) ? Config::get("app.home") : $route
            : "login";*/

        self::load($route);
    }

    private static function load(string $route): never
    {
        $file = PAGES_PATH . "/{$route}.php";

        if (!file_exists($file)) {
            $file = PAGES_PATH . "/{$route}/index.php";
        }

        if (!file_exists($file)) {
            $file = PAGES_PATH . "/errors/notfound/index.php";
            http_response_code(404);
        }

        require_once $file;

        exit;
    }

    private static function getRoute(): string
    {
        $route = parse_url(
            $_SERVER["REQUEST_URI"],
            PHP_URL_PATH
        );

        $basePath = parse_url(
            BASE_URL,
            PHP_URL_PATH
        );

        $route = substr(
            $route,
            strlen($basePath)
        );

        return trim($route, "/");
    }
}