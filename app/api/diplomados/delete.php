<?php
require_once "../../../bootstrap.php";

ExceptionHandler::register();
$request = Request::capture();

if (!Session::has("auth.id"))
    ApiResponse::unauthorized("Su sesión ha expirado o no tiene permiso para acceder a este recurso, inicie sesión de nuevo.");

$validator = Validator::make(
    $request,
    [
        "diplomado" => "required|integer"
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

$db = ConnectionManager::connection();

$db->transaction(function (Connection $db) use ($diplomado) {
    $db->update(
        "
            update tbl_diplomado td
            set
                status_id = -1,
                usuario_eliminacion_id = ?,
                fecha_eliminacion = current_timestamp()
            where td.status_id = 1 and td.id = ?;
        ",
        [
            Session::get("auth.id"),
            $diplomado
        ]
    );

    AuditLogger::log(
        $db,
        action: "diplomado.delete",
        entity: "diplomado",
        entityId: $diplomado,
        data: [],
        result: "success"
    );
});

ApiResponse::success(null, "Diplomado eliminado.");