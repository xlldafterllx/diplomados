<?php
class Config
{
    /**
     * Archivos de configuración cargados.
     *
     * @var array<string, array>
     */
    private static array $config = [];

    private function __construct()
    {
    }

    public static function get(string $key, $default = null)
    {
        $segments = explode(".", $key);

        $file = array_shift($segments);

        self::load($file);

        return self::getValue(
            self::$config[$file],
            implode(".", $segments),
            $default
        );
    }

    public static function has(string $key): bool
    {
        return self::get($key, "__CONFIG_NOT_FOUND__") !== "__CONFIG_NOT_FOUND__";
    }

    private static function load(string $file): void
    {
        if (isset(self::$config[$file])) {
            return;
        }

        $path = __DIR__ . "/../config/{$file}.php";

        if (!file_exists($path)) {
            throw new Exception("Configuration file '{$file}' does not exist.");
        }

        self::$config[$file] = require $path;
    }

    private static function getValue(array $data, string $key, $default = null)
    {
        if ($key === "") {
            return $data;
        }

        foreach (explode(".", $key) as $segment) {

            if (!is_array($data) || !array_key_exists($segment, $data)) {
                return $default;
            }

            $data = $data[$segment];
        }

        return $data;
    }
}