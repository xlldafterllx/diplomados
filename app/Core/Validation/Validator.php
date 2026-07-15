<?php

class Validator
{
    private Request $request;

    /**
     * Reglas definidas por el usuario.
     *
     * [
     *     "nombre" => "required|string|max:100"
     * ]
     */
    private array $rules = [];

    /**
     * Errores encontrados.
     *
     * [
     *     "nombre" => [
     *          "El campo nombre es obligatorio."
     *     ]
     * ]
     */
    private array $errors = [];

    /**
     * Evita ejecutar la validación más de una vez.
     */
    private bool $validated = false;

    /**
     * Mensajes por defecto.
     */
    private array $messages = [
        "required" => "El campo :field es obligatorio.",
        "string" => "El campo :field debe ser una cadena de texto.",
        "integer" => "El campo :field debe ser un número entero.",
        "float" => "El campo :field debe ser un número.",
        "boolean" => "El campo :field debe ser verdadero o falso.",
        "array" => "El campo :field debe ser un arreglo.",
        "date" => "El campo :field no contiene una fecha válida.",
        "datetime" => "El campo :field no contiene una fecha y hora válida.",
        "email" => "El campo :field debe ser un correo electrónico válido.",
        "file" => "El campo :field debe contener un archivo.",
        "mimetype" => "El archivo del campo :field no tiene un formato permitido.",
        "maxFileSize" => "El archivo del campo :field excede el tamaño permitido.",
        "min" => "El campo :field no cumple el tamaño mínimo.",
        "max" => "El campo :field excede el tamaño máximo.",
    ];

    private function __construct()
    {
    }

    public static function make(Request $request, array $rules): self
    {
        $validator = new self();

        $validator->request = $request;
        $validator->rules = $rules;

        return $validator;
    }

    public function fails(): bool
    {
        $this->validate();

        return !empty($this->errors);
    }

    public function passes(): bool
    {
        return !$this->fails();
    }

    public function errors(): array
    {
        $this->validate();
        return $this->errors;
    }

    public function validated(): array
    {
        $this->validate();

        if (!empty($this->errors)) {
            return [];
        }

        $data = [];

        foreach ($this->rules as $field => $rule) {
            $data[$field] = $this->request->value($field);
        }

        return $data;
    }

    /**
     * Ejecuta la validación.
     */
    private function validate(): void
    {
        if ($this->validated) {
            return;
        }

        $this->validated = true;

        foreach ($this->rules as $field => $rules) {
            $parsedRules = $this->parseRules($rules);

            foreach ($parsedRules as $rule) {
                $method = $this->validatorMethod($rule["name"]);

                if ($method === null) {
                    continue;
                }

                if (!$this->$method($field, $rule["parameter"])) {
                    break;
                }
            }
        }
    }

    /**
     * Convierte:
     *
     * required|string|max:100
     *
     * en
     *
     * [
     *      [
     *          "name"=>"required",
     *          "parameter"=>null
     *      ],
     *      [
     *          "name"=>"string",
     *          "parameter"=>null
     *      ]
     * ]
     */
    private function parseRules(string $rules): array
    {
        $result = [];

        foreach (explode("|", $rules) as $rule) {
            [$name, $parameter] = array_pad(
                explode(":", $rule, 2),
                2,
                null
            );

            $result[] = [
                "name" => trim($name),
                "parameter" => $parameter
            ];
        }

        return $result;
    }

    /**
     * Obtiene el nombre del método validador.
     */
    private function validatorMethod(string $rule): ?string
    {
        $method = "validate" . ucfirst($rule);

        return method_exists($this, $method)
            ? $method
            : null;
    }

    /**
     * Agrega un error.
     */
    private function addError(string $field, string $message): void
    {
        $this->errors[$field][] = $message;
    }

    /**
     * Registra un error usando los mensajes por defecto.
     */

    private function fail(string $field, string $rule, array $replace = []): bool
    {
        $message = $this->messages[$rule]
            ?? "El campo :field es inválido.";

        $replace = array_merge([
            ":field" => $field
        ], $replace);

        $this->addError(
            $field,
            strtr($message, $replace)
        );

        return false;
    }

    private function skipEmpty(string $field): bool
    {
        $value = $this->request->value($field);

        if ($value instanceof UploadedFile) {
            return false;
        }

        if (is_array($value)) {
            return empty($value);
        }

        return $value === null || trim((string) $value) === '';
    }

    /**
     * Podemos agregar reglas después de haber creado las iniciales
     */
    public function addRules(array $rules): self
    {
        $this->rules = array_merge(
            $this->rules,
            $rules
        );

        return $this;
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDADORES
    |--------------------------------------------------------------------------
    */

    private function validateRequired(string $field, $parameter): bool
    {
        $value = $this->request->value($field);

        if ($value instanceof UploadedFile) {
            return $value->isValid();
        }

        if (is_array($value)) {
            return !empty($value);
        }

        if ($value !== null && trim((string) $value) !== '') {
            return true;
        }

        return $this->fail($field, "required");
    }

    private function validateNullable(string $field, $parameter): bool
    {
        return !$this->skipEmpty($field);
    }

    private function validateString(string $field, $parameter): bool
    {
        if ($this->skipEmpty($field)) {
            return true;
        }

        if ($this->request->string($field) !== null) {
            return true;
        }

        return $this->fail($field, "string");
    }

    private function validateInteger(string $field, $parameter): bool
    {
        if ($this->skipEmpty($field)) {
            return true;
        }

        if ($this->request->integer($field) !== null) {
            return true;
        }

        return $this->fail($field, "integer");
    }

    private function validateFloat(string $field, $parameter): bool
    {
        if ($this->skipEmpty($field)) {
            return true;
        }

        if ($this->request->float($field) !== null) {
            return true;
        }

        return $this->fail($field, "float");
    }

    private function validateBoolean(string $field, $parameter): bool
    {
        if ($this->skipEmpty($field)) {
            return true;
        }

        if ($this->request->boolean($field) !== null) {
            return true;
        }

        return $this->fail($field, "boolean");
    }

    private function validateArray(string $field, $parameter): bool
    {
        if ($this->skipEmpty($field)) {
            return true;
        }

        if (is_array($this->request->value($field))) {
            return true;
        }

        return $this->fail($field, "array");
    }

    private function validateDate(string $field, $parameter): bool
    {
        if ($this->skipEmpty($field)) {
            return true;
        }

        if ($this->request->date($field) !== null) {
            return true;
        }

        return $this->fail($field, "date");
    }

    private function validateDatetime(string $field, $parameter): bool
    {
        if ($this->skipEmpty($field)) {
            return true;
        }

        if ($this->request->datetime($field) !== null) {
            return true;
        }

        return $this->fail($field, "datetime");
    }

    private function validateEmail(string $field, $parameter): bool
    {
        if ($this->skipEmpty($field)) {
            return true;
        }

        $email = $this->request->string($field);

        if (
            $email !== null &&
            filter_var($email, FILTER_VALIDATE_EMAIL)
        ) {
            return true;
        }

        return $this->fail($field, "email");
    }

    private function validateFile(string $field, $parameter): bool
    {
        if ($this->skipEmpty($field)) {
            return true;
        }

        return $this->request->value($field) instanceof UploadedFile
            ? true
            : $this->fail($field, "file");
    }

    private function validateMin(string $field, $parameter): bool
    {
        if ($this->skipEmpty($field)) {
            return true;
        }

        $value = $this->request->string($field);

        if ($value === null) {
            return $this->fail(
                $field,
                "min",
                [
                    ":value" => $parameter
                ]
            );
        }


        if (mb_strlen($value) >= (int) $parameter) {
            return true;
        }

        return $this->fail(
            $field,
            "min",
            [
                ":value" => $parameter
            ]
        );
    }

    private function validateMax(string $field, $parameter): bool
    {
        if ($this->skipEmpty($field)) {
            return true;
        }

        $value = $this->request->string($field);

        if ($value === null) {
            return $this->fail(
                $field,
                "max",
                [
                    ":value" => $parameter
                ]
            );
        }


        if (mb_strlen($value) <= (int) $parameter) {
            return true;
        }

        return $this->fail(
            $field,
            "max",
            [
                ":value" => $parameter
            ]
        );
    }

    private function validateMimetype(string $field, $parameter): bool
    {
        if ($this->skipEmpty($field)) {
            return true;
        }
        
        $file = $this->request->value($field);

        if (!$file instanceof UploadedFile) {
            return $this->fail($field, "mimetype");
        }

        $mime = $file->detectMimeType();

        $allowed = array_map(
            "trim",
            explode(",", $parameter)
        );

        if (in_array($mime, $allowed, true)) {
            return true;
        }

        return $this->fail($field, "mimetype");
    }

    private function validateMaxFileSize(string $field, $parameter): bool
    {
        $file = $this->request->value($field);

        if (!$file instanceof UploadedFile) {
            return true;
        }

        return $file->getSize() <= (int) $parameter
            ? true
            : $this->fail($field, "maxFileSize");
    }
}