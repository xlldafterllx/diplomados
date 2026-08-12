<?php
class TokenHelper
{
    public static function generate(int $bytes = 16): string
    {
        return bin2hex(random_bytes($bytes));
    }
}