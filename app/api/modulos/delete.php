<?php
require_once "../../../bootstrap.php";

ExceptionHandler::register();
$request = Request::capture();

if (!Session::has("auth.id"))
    ApiResponse::unauthorized("Su sesión ha expirado o no tiene permiso para acceder a este recurso, inicie sesión de nuevo.");

$validator = Validator::make(
    $request,
    [
        "diplomado" => "required|integer",
        "modulo" => "required|integer",
    ]
);

if ($validator->fails())
    ApiResponse::unprocessableContent(
        array_values($validator->errors())[0][0],
        [
            "message" => "Unprocessable Content",
            "errors" => $validator->errors()
        ]
    );

$diplomado = $request->integer("diplomado");
$modulo = $request->integer("modulo");

$db = ConnectionManager::connection();

$db->transaction(function (Connection $db) use ($diplomado, $modulo) {
    $db->update(
        "
            update tbl_modulo tm
            set
                status_id = -1,
                usuario_eliminacion_id = ?,
                fecha_eliminacion = current_timestamp()
            where tm.status_id = 1 and tm.diplomado_id = ? and tm.id = ?;
        ",
        [
            Session::get("auth.id"),
            $diplomado,
            $modulo
        ]
    );

    AuditLogger::log(
        $db,
        action: "modulo.delete",
        entity: "modulo",
        entityId: $modulo,
        data: [],
        result: "success"
    );
});

ApiResponse::success(null, "Módulo eliminado.");