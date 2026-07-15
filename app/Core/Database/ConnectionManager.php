<?php

class ConnectionManager
{
    /**
     * @var array<string, mysqli>
     */
    private static array $connections = [];

    private function __construct()
    {
    }

    public static function connection(string $name = "default"): Connection
    {
        return new Connection(
            self::getConnection($name)
        );
    }

    private static function getConnection(string $name): mysqli
    {
        if (!isset(self::$connections[$name])) {
            self::$connections[$name] = self::createConnection($name);
        }

        return self::$connections[$name];
    }

    private static function createConnection(string $name): mysqli
    {
        $config = Config::get("database.{$name}");

        if ($config === null) {
            throw new Exception("Database connection '{$name}' is not configured.");
        }

        $connection = new mysqli(
            $config["host"],
            $config["username"],
            $config["password"],
            $config["database"],
            $config["port"]
        );

        if ($connection->connect_errno) {
            throw new Exception($connection->connect_error);
        }

        if (!$connection->set_charset($config["charset"])) {
            throw new Exception(
                "Unable to set charset '{$config['charset']}'."
            );
        }

        return $connection;
    }
}