<?php
class FileStorage
{
    private string $basePath;

    public function __construct(string $basePath)
    {
        $this->basePath = rtrim(
            $basePath,
            "/\\"
        );
    }

    public function store(UploadedFile $file, StoragePath $path, string $logicalName): StoredFile
    {
        if (!$file->isValid()) {
            throw new RuntimeException(
                "Archivo inválido."
            );
        }

        $directory = $path->absolute(
            $this->basePath
        );

        $this->createDirectory(
            $directory
        );

        $filename = $this->buildFilename(
            $file,
            $logicalName
        );

        $destination =
            $directory
            . DIRECTORY_SEPARATOR
            . $filename;

        $mimeType = $file->detectMimeType();
        $extension = $file->getExtension();
        $size = $file->getSize();
        $originalName = $file->getClientName();

        $this->move(
            $file,
            $destination
        );

        $hash = hash_file(
            "sha256",
            $destination
        );

        return new StoredFile(
            $originalName,
            $filename,
            $path->relative(),
            $extension,
            $mimeType,
            $size,
            $hash
        );
    }

    private function createDirectory(string $directory): void
    {
        if (is_dir($directory)) {
            return;
        }

        if (!mkdir($directory, 0755, true) && !is_dir($directory)) {
            $error = error_get_last();

            throw new RuntimeException(
                sprintf(
                    "No fue posible crear el directorio '%s'. %s",
                    $directory,
                    $error["message"] ?? ""
                )
            );
        }
    }

    private function move(UploadedFile $file, string $destination): void
    {

        if (!move_uploaded_file($file->getTempName(), $destination)) {
            $error = error_get_last();

            throw new RuntimeException(
                sprintf(
                    "No fue posible almacenar el archivo '%s'. %s",
                    $destination,
                    $error["message"] ?? ""
                )
            );
        }
    }

    private function buildFilename(UploadedFile $file, string $logicalName): string
    {
        $unique = bin2hex(random_bytes(16));
        $logicalName = strtolower($logicalName);

        $logicalName = preg_replace(
            '/[^a-z0-9_]/',
            '_',
            $logicalName
        );

        return sprintf(
            '%s_%s.%s',
            $unique,
            $logicalName,
            $file->getExtension()
        );
    }
}