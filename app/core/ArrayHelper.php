<?php
class ArrayHelper
{
    public static function get(array $array, ?string $key = null, mixed $default = null): mixed
    {
        if ($key === null) {
            return $array;
        }

        foreach (explode(".", $key) as $segment) {
            if (!is_array($array) || !array_key_exists($segment, $array)) {
                return $default;
            }

            $array = $array[$segment];
        }

        return $array;
    }

    public static function set(array &$array, string $key, mixed $value): void
    {
        $segments = explode(".", $key);

        $current = &$array;

        foreach ($segments as $segment) {
            if (!isset($current[$segment]) || !is_array($current[$segment])) {
                $current[$segment] = [];
            }

            $current = &$current[$segment];
        }

        $current = $value;
    }

    public static function has(array $array, string $key): bool
    {
        return self::get($array, $key) !== null;
    }

    public static function remove(array &$array, string $key): void
    {
        $segments = explode(".", $key);

        $lastSegment = array_pop($segments);

        $current = &$array;

        foreach ($segments as $segment) {
            if (!isset($current[$segment]) || !is_array($current[$segment])) {
                return;
            }

            $current = &$current[$segment];
        }

        unset($current[$lastSegment]);
    }
}