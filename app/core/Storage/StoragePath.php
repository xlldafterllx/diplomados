<?php

final class StoragePath
{
    /**
     * Segmentos que conforman la ruta.
     *
     * Ejemplo:
     * [
     *     "entradas",
     *     "2026",
     *     "07",
     *     "13",
     *     "1532"
     * ]
     */
    private array $segments = [];

    private function __construct(array $segments = [])
    {
        foreach ($segments as $segment) {
            $this->append($segment);
        }
    }

    /**
     * Crea una nueva ruta.
     */
    public static function fromSegments(...$segments): self
    {
        return new self($segments);
    }

    /**
     * Agrega un segmento.
     */
    public function append(string $segment): self
    {
        $segment = trim($segment);

        if ($segment === '') {
            return $this;
        }

        $segment = trim($segment, "/\\");

        $this->segments[] = $segment;

        return $this;
    }

    /**
     * Agrega varios segmentos.
     */
    public function appendMany(array $segments): self
    {
        foreach ($segments as $segment) {
            $this->append($segment);
        }

        return $this;
    }

    /**
     * Devuelve los segmentos.
     */
    public function segments(): array
    {
        return $this->segments;
    }

    /**
     * Ruta relativa.
     *
     * entradas/2026/07/13/1532
     */
    public function relative(): string
    {
        return implode(
            DIRECTORY_SEPARATOR,
            $this->segments
        );
    }

    /**
     * Ruta absoluta.
     */
    public function absolute(string $basePath): string
    {
        return rtrim($basePath, "/\\")
            . DIRECTORY_SEPARATOR
            . $this->relative();
    }

    /**
     * Último segmento.
     */
    public function last(): ?string
    {
        if (empty($this->segments)) {
            return null;
        }

        return end($this->segments);
    }

    /**
     * Cantidad de segmentos.
     */
    public function count(): int
    {
        return count($this->segments);
    }

    /**
     * Convierte la ruta a string.
     */
    public function __toString(): string
    {
        return $this->relative();
    }

    public static function dated(string $root, $identifier, ?DateTimeInterface $date = null): self
    {
        $date ??= new DateTimeImmutable();

        return self::fromSegments(
            $root,
            $date->format("Y"),
            $date->format("m"),
            $date->format("d"),
            (string) $identifier
        );
    }
}