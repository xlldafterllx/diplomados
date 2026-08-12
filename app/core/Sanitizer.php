<?php
class Sanitizer
{
    public static function clean(array $data, bool $emptyToNull = false): array
    {
        foreach ($data as $key => $value) {

            if (is_array($value)) {
                $data[$key] = self::clean($value, $emptyToNull);
                continue;
            }

            if (!is_string($value)) {
                continue;
            }

            $value = trim($value);

            if ($emptyToNull && $value === "") {
                $value = null;
            }

            $data[$key] = $value;
        }

        return $data;
    }
}