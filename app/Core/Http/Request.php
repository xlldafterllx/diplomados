<?php
class Request
{
    private array $data = [];
    private array $files = [];
    private array $headers = [];
    private array $server = [];
    private string $method = "GET";
    private string $contentType = "";

    private function __construct()
    {
    }

    public static function capture(): self
    {
        $request = new self();

        $request->loadServer();

        $request->loadHeaders();

        $request->loadInput();

        $request->loadFiles();

        return $request;
    }

    private function loadServer(): void
    {
        $this->server = $_SERVER;
        $this->method = $_SERVER["REQUEST_METHOD"] ?? "GET";
        $this->contentType = $_SERVER["CONTENT_TYPE"] ?? "";
    }

    private function loadHeaders(): void
    {
        if (function_exists("getallheaders")) {
            $this->headers = getallheaders();
            return;
        }

        foreach ($_SERVER as $key => $value) {
            if (strpos($key, "HTTP_") === 0) {
                $name = str_replace(
                    "_",
                    "-",
                    substr($key, 5)
                );

                $this->headers[$name] = $value;
            }
        }
    }

    private function loadInput(): void
    {
        if ($this->isJson()) {
            $this->loadJson();
        } else {
            $this->loadFormData();
        }

        $this->data = Sanitizer::clean($this->data, true);
    }

    private function isJson(): bool
    {
        return stripos(
            $this->contentType,
            "application/json"
        ) !== false;
    }

    private function loadFormData(): void
    {
        switch ($this->method) {
            case "POST":
                $this->data = $_POST;
                break;

            case "PUT":

            case "PATCH":

            case "DELETE":
                parse_str(
                    file_get_contents("php://input"),
                    $this->data
                );

                break;
            default:
                $this->data = $_GET;
        }
    }

    private function loadJson(): void
    {
        $body = file_get_contents("php://input");

        $this->data =
            json_decode($body, true) ?? [];
    }

    private function loadFiles(): void
    {
        $this->files = $this->normalizeFiles($_FILES);
    }

    private function getNested(array $data, string $key, $default = null)
    {
        foreach (explode(".", $key) as $segment) {
            if (!is_array($data) || !array_key_exists($segment, $data)) {
                return $default;
            }

            $data = $data[$segment];
        }

        return $data;
    }

    private function normalizeFiles(array $files): array
    {
        $normalized = [];

        foreach ($files as $field => $fileData) {

            if (!isset($fileData["name"])) {
                continue;
            }

            $normalized[$field] = $this->normalizeUploadedFiles($fileData);
        }

        return $normalized;
    }

    private function normalizeUploadedFiles(array $fileData)
    {
        if (!is_array($fileData["name"])) {
            return new UploadedFile([
                "name" => $fileData["name"],
                "type" => $fileData["type"],
                "tmp_name" => $fileData["tmp_name"],
                "error" => $fileData["error"],
                "size" => $fileData["size"],
            ]);
        }

        $result = [];

        foreach ($fileData["name"] as $key => $value) {
            $result[$key] = $this->normalizeUploadedFiles([
                "name" => $fileData["name"][$key],
                "type" => $fileData["type"][$key],
                "tmp_name" => $fileData["tmp_name"][$key],
                "error" => $fileData["error"][$key],
                "size" => $fileData["size"][$key],
            ]);
        }

        return $result;
    }

    private function createDate(string $value, string $format): ?DateTimeImmutable
    {
        $date = DateTimeImmutable::createFromFormat($format, $value);

        if ($date === false) {
            return null;
        }

        $errors = DateTimeImmutable::getLastErrors();

        if (
            $errors !== false &&
            ($errors['warning_count'] > 0 || $errors['error_count'] > 0)
        ) {
            return null;
        }

        return $date;
    }

    public function value(?string $key = null, $default = null)
    {
        if ($key === null) {
            return array_replace_recursive(
                $this->data,
                $this->files
            );
        }

        $value = $this->getNested($this->data, $key);

        if ($value !== null) {
            return $value;
        }

        return $this->getNested($this->files, $key, $default);
    }

    public function all(): array
    {
        return $this->data;
    }

    public function allFiles(): array
    {
        return $this->files;
    }

    public function filled(string $key): bool
    {
        $value = $this->input($key);

        if (is_array($value)) {
            return !empty($value);
        }

        return $value !== null
            && trim((string) $value) !== '';
    }

    public function isEmpty(string $key): bool
    {
        return !$this->filled($key);
    }

    public function string(string $key, ?string $default = null): ?string
    {
        $value = $this->input($key);

        if ($value === null) {
            return $default;
        }

        if (is_array($value)) {
            return $default;
        }

        return (string) $value;
    }

    public function integer(string $key, ?int $default = null): ?int
    {
        $value = $this->input($key);

        if ($value === null || $value === '') {
            return $default;
        }

        $result = filter_var($value, FILTER_VALIDATE_INT);

        return $result === false
            ? $default
            : $result;
    }

    public function float(string $key, ?float $default = null): ?float
    {
        $value = $this->input($key);

        if ($value === null || $value === '') {
            return $default;
        }

        $result = filter_var($value, FILTER_VALIDATE_FLOAT);

        return $result === false
            ? $default
            : (float) $result;
    }

    public function boolean(string $key, ?bool $default = null): ?bool
    {
        $value = $this->input($key);

        if ($value === null || $value === '') {
            return $default;
        }

        return filter_var(
            $value,
            FILTER_VALIDATE_BOOLEAN,
            FILTER_NULL_ON_FAILURE
        ) ?? $default;
    }

    public function array(string $key, ?array $default = null): ?array
    {
        $value = $this->input($key);

        return is_array($value)
            ? $value
            : $default;
    }

    public function date(string $key, ?DateTimeImmutable $default = null): ?DateTimeImmutable
    {
        $value = $this->string($key);

        if ($value === null) {
            return $default;
        }

        return $this->createDate($value, 'd/m/Y') ?? $default;
    }

    public function datetime(string $key, ?DateTimeImmutable $default = null): ?DateTimeImmutable
    {
        $value = $this->string($key);

        if ($value === null) {
            return $default;
        }

        return $this->createDate($value, 'd/m/Y H:i') ?? $default;
    }

    public function input(?string $key = null, $default = null)
    {
        if ($key === null) {
            return $this->data;
        }

        return $this->getNested($this->data, $key, $default);
    }

    public function has(string $key): bool
    {
        return $this->input($key) !== null;
    }

    public function file(?string $key = null): UploadedFile|array|null
    {
        if ($key === null) {
            return $this->files;
        }

        $file = $this->getNested($this->files, $key);

        return $file instanceof UploadedFile
            ? $file
            : null;
    }

    public function hasFile(string $key): bool
    {
        $file = $this->file($key);
        return $file instanceof UploadedFile && $file->isValid();
    }

    public function method(): string
    {
        return $this->method;
    }

    public function header(string $name, $default = null)
    {
        return $this->headers[$name] ?? $default;
    }

    public function server(string $key, $default = null)
    {
        return $this->server[$key] ?? $default;
    }

    public function ip(): ?string
    {
        return $this->server("REMOTE_ADDR");
    }

    public function userAgent(): ?string
    {
        return $this->server("HTTP_USER_AGENT");
    }
}