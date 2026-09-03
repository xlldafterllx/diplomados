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
        "actividad" => "required|integer"
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
$actividad = $request->integer("actividad");

$db = ConnectionManager::connection();

$db->transaction(function (Connection $db) use ($diplomado, $modulo, $actividad) {
    $db->update(
        "
            update tbl_actividad ta
            set
                status_id = -1,
                usuario_eliminacion_id = ?,
                fecha_eliminacion = current_timestamp()
            where ta.status_id = 1 and ta.diplomado_id = ? and ta.modulo_id = ? and ta.id = ?;
        ",
        [
            Session::get("auth.id"),
            $diplomado,
            $modulo,
            $actividad
        ]
    );

    AuditLogger::log(
        $db,
        action: "actividad.delete",
        entity: "actividad",
        entityId: $actividad,
        data: [],
        result: "success"
    );
});

ApiResponse::success(null, "Actividad eliminada.");