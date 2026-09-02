<?php
class AuditLogger
{
    public static function log($db, string $action, ?string $entity = null, ?int $entityId = null, array $data = [], string $result = "success"): void
    {
        $requestId = RequestContext::id();

        $db->insert(
            "
                insert into tbl_auditoria (
                    request_id,
                    usuario_id,
                    usuario_nombre,
                    accion,
                    entidad,
                    entidad_id,
                    resultado,
                    ruta,
                    metodo,
                    direccion_ip,
                    user_agent,
                    datos
                ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ",
            [
                $requestId,
                Session::get("auth.id"),
                Session::get("auth.name"),
                $action,
                $entity,
                $entityId,
                $result,
                $_SERVER["REQUEST_URI"] ?? null,
                $_SERVER["REQUEST_METHOD"] ?? null,
                $_SERVER["REMOTE_ADDR"] ?? null,
                $_SERVER["HTTP_USER_AGENT"] ?? null,
                $data
                ? json_encode(
                    $data,
                    JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
                )
                : null
            ]
        );
    }

    public static function obtenerCambios(array $anterior, array $nuevo): array
    {
        $cambios = [];

        foreach ($nuevo as $campo => $nuevoValor) {
            $valorAnterior = $anterior[$campo] ?? null;

            if ((string) $valorAnterior !== (string) $nuevoValor) {
                $cambios[$campo] = [
                    "anterior" => $valorAnterior,
                    "nuevo" => $nuevoValor
                ];
            }
        }

        return $cambios;
    }
}