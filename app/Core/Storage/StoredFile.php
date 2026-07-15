<?php

final class StoredFile
{
    /**
     * Nombre original enviado por el cliente.
     */
    private string $originalName;

    /**
     * Nombre generado por el sistema.
     */
    private string $storedName;

    /**
     * Directorio relativo donde fue almacenado.
     *
     * Ejemplo:
     * entradas/2026/07/13/1532
     */
    private string $directory;

    /**
     * Extensión del archivo.
     */
    private string $extension;

    /**
     * MIME Type detectado.
     */
    private string $mimeType;

    /**
     * Tamaño en bytes.
     */
    private int $size;

    /**
     * Hash SHA-256 del archivo.
     */
    private ?string $hash;

    public function __construct(
        string $originalName,
        string $storedName,
        string $directory,
        string $extension,
        string $mimeType,
        int $size,
        ?string $hash = null
    ) {
        $this->originalName = $originalName;
        $this->storedName = $storedName;
        $this->directory = trim($directory, "/\\");
        $this->extension = strtolower($extension);
        $this->mimeType = $mimeType;
        $this->size = $size;
        $this->hash = $hash;
    }

    public function getOriginalName(): string
    {
        return $this->originalName;
    }

    public function getStoredName(): string
    {
        return $this->storedName;
    }

    public function getDirectory(): string
    {
        return $this->directory;
    }

    /**
     * Devuelve:
     * entradas/2026/07/13/1532/uuid_documento.pdf
     */
    public function getRelativePath(): string
    {
        return $this->directory
            . DIRECTORY_SEPARATOR
            . $this->storedName;
    }

    /**
     * Devuelve únicamente el nombre sin extensión.
     */
    public function getFilename(): string
    {
        return pathinfo(
            $this->storedName,
            PATHINFO_FILENAME
        );
    }

    public function getExtension(): string
    {
        return $this->extension;
    }

    public function getMimeType(): string
    {
        return $this->mimeType;
    }

    public function getSize(): int
    {
        return $this->size;
    }

    public function getHash(): ?string
    {
        return $this->hash;
    }

    /**
     * Construye la ruta absoluta usando la ruta base.
     */
    public function getAbsolutePath(string $basePath): string
    {
        return rtrim($basePath, "/\\")
            . DIRECTORY_SEPARATOR
            . $this->getRelativePath();
    }

    public function toArray(): array
    {
        return [
            "original_name" => $this->originalName,
            "stored_name" => $this->storedName,
            "directory" => $this->directory,
            "relative_path" => $this->getRelativePath(),
            "extension" => $this->extension,
            "mime_type" => $this->mimeType,
            "size" => $this->size,
            "hash" => $this->hash
        ];
    }
}