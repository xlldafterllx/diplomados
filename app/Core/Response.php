<?php
class Response
{
    public static function redirect(string $url): never
    {
        header("Location: {$url}");
        exit;
    }

    public static function back(): never
    {
        $url = $_SERVER["HTTP_REFERER"] ?? BASE_URL;

        self::redirect($url);
    }

    public static function refresh(): never
    {
        self::redirect($_SERVER["REQUEST_URI"]);
    }
}