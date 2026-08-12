<?php
class DatabaseException extends Exception
{
    private string $sql;

    private array $parameters;

    public function __construct(
        string $message,
        int $code,
        string $sql,
        array $parameters = [],
        ?Throwable $previous = null
    ) {
        parent::__construct(
            $message,
            $code,
            $previous
        );

        $this->sql = $sql;
        $this->parameters = $parameters;
    }

    public function sql(): string
    {
        return $this->sql;
    }

    public function parameters(): array
    {
        return $this->parameters;
    }

    public function interpolatedSql(): string
    {
        $sql = $this->sql;

        foreach ($this->parameters as $parameter) {

            $value = $this->formatParameter($parameter);

            $sql = preg_replace(
                '/\?/',
                $value,
                $sql,
                1
            );
        }

        return $sql;
    }

    private function formatParameter($value): string
    {
        if ($value === null) {
            return "NULL";
        }

        if (is_bool($value)) {
            return $value ? "1" : "0";
        }

        if (is_numeric($value)) {
            return (string) $value;
        }

        return "'" .
            str_replace("'", "''", (string) $value)
            . "'";
    }
}