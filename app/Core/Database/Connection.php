<?php
class Connection
{
    private mysqli $connection;

    public function __construct(mysqli $connection)
    {
        $this->connection = $connection;
    }

    private function prepare(string $sql): mysqli_stmt
    {
        $statement = $this->connection->prepare($sql);

        if ($statement === false) {
            throw new Exception(
                $this->connection->error,
                $this->connection->errno
            );
        }

        return $statement;
    }

    private function bindParameters(mysqli_stmt $statement, array $parameters): void
    {
        if (empty($parameters)) {
            return;
        }

        $types = $this->parameterTypes($parameters);

        $arguments = array_merge(
            [$types],
            $this->parameterReferences($parameters)
        );

        if (!call_user_func_array([$statement, "bind_param"], $arguments)) {
            throw new Exception($statement->error, $statement->errno);
        }
    }

    private function parameterTypes(array $parameters): string
    {
        $types = "";
        foreach ($parameters as $parameter) {
            switch (true) {
                case is_int($parameter):
                    $types .= "i";
                    break;
                case is_float($parameter):
                    $types .= "d";
                    break;
                case is_bool($parameter):
                    $types .= "i";
                    break;
                default:
                    $types .= "s";
            }
        }

        return $types;
    }

    private function parameterReferences(array &$parameters): array
    {
        $references = [];

        foreach ($parameters as $key => &$parameter) {
            $references[$key] = &$parameter;
        }

        return $references;
    }

    private function executeStatement(mysqli_stmt $statement): void
    {
        if (!$statement->execute()) {
            throw new Exception(
                $statement->error,
                $statement->errno
            );
        }
    }

    private function execute(string $sql, array $parameters = []): mysqli_stmt {
        try {
            $statement = $this->prepare($sql);

            $this->bindParameters(
                $statement,
                $parameters
            );

            $this->executeStatement(
                $statement
            );

            return $statement;

        } catch (Throwable $e) {
            throw new DatabaseException(
                $e->getMessage(),
                $e->getCode(),
                $sql,
                $parameters,
                $e
            );
        }
    }

    private function run(string $sql, array $parameters, callable $callback)
    {
        $statement = $this->execute($sql, $parameters);

        try {
            return $callback($statement);
        } finally {
            $statement->close();
        }
    }

    public function select(string $sql, array $parameters = []): array
    {
        return $this->run(
            $sql,
            $parameters,
            function (mysqli_stmt $statement): array {
                return $statement->get_result()->fetch_all(MYSQLI_ASSOC);
            }
        );
    }

    public function first(string $sql, array $parameters = []): ?array
    {
        return $this->run(
            $sql,
            $parameters,
            function (mysqli_stmt $statement): ?array {
                $row = $statement->get_result()->fetch_assoc();
                return $row ?: null;

            }
        );
    }

    public function value(string $sql, array $parameters = [])
    {
        $row = $this->first($sql, $parameters);
        return $row === null ? null : reset($row);
    }

    public function insert(string $sql, array $parameters = []): int
    {
        return $this->run(
            $sql,
            $parameters,
            function (): int {
                return $this->connection->insert_id;
            }
        );
    }

    public function update(string $sql, array $parameters = []): int
    {
        return $this->run(
            $sql,
            $parameters,
            function (mysqli_stmt $statement): int {
                return $statement->affected_rows;
            }
        );
    }

    public function delete(string $sql, array $parameters = []): int
    {
        return $this->update(
            $sql,
            $parameters
        );
    }

    public function statement(string $sql, array $parameters = []): bool
    {
        return $this->run(
            $sql,
            $parameters,
            function (): bool {

                return true;

            }
        );
    }

    public function transaction(callable $callback)
    {
        $this->connection->begin_transaction();

        try {
            $result = $callback($this);
            $this->connection->commit();
            return $result;
        } catch (Throwable $e) {
            $this->connection->rollback();
            throw $e;
        }
    }
}