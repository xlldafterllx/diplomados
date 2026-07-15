<?php

final class UploadedFile
{
    private string $clientName;
    private string $tempName;
    private string $mimeType;
    private int $size;
    private int $error;

    public function __construct(array $file)
    {
        $this->clientName = $file["name"];
        $this->tempName = $file["tmp_name"];
        $this->mimeType = $file["type"];
        $this->size = $file["size"];
        $this->error = $file["error"];
    }

    public function getClientName(): string
    {
        return $this->clientName;
    }

    public function getClientFilename(): string
    {
        return pathinfo(
            $this->clientName,
            PATHINFO_FILENAME
        );
    }

    public function getExtension(): string
    {
        return strtolower(
            pathinfo(
                $this->clientName,
                PATHINFO_EXTENSION
            )
        );
    }

    public function getMimeType(): string
    {
        return $this->mimeType;
    }

    public function getSize(): int
    {
        return $this->size;
    }

    public function getError(): int
    {
        return $this->error;
    }

    public function getTempName(): string
    {
        return $this->tempName;
    }

    public function isValid(): bool
    {
        return $this->error === UPLOAD_ERR_OK;
    }

    public function isImage(): bool
    {
        return strpos($this->mimeType, "image/") === 0;
    }

    public function isPdf(): bool
    {
        return $this->mimeType === "application/pdf";
    }

    public function getHash(string $algorithm = "sha256"): string
    {
        return hash_file(
            $algorithm,
            $this->tempName
        );
    }

    public function detectMimeType(): string
    {
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        return $finfo->file($this->tempName);
    }

    public function hasMimeType(array $allowed): bool
    {
        return in_array(
            $this->detectMimeType(),
            $allowed,
            true
        );
    }

    public function hasMaxSize(int $bytes): bool
    {
        return $this->size <= $bytes;
    }
}