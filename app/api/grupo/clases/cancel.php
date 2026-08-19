<?php
require_once "../../../../bootstrap.php";

ExceptionHandler::register();
$request = Request::capture();

if (!Session::has("auth.id"))
    ApiResponse::unauthorized("Su sesión ha expirado o no tiene permiso para acceder a este recurso, inicie sesión de nuevo.");

$validator = Validator::make(
    $request,
    [
        "clase" => "required|integer"
    ]
);

if ($validator->fails())
    ApiResponse::unprocessableContent(
        "Uno o varios campos no cumplen con el formato correspondiente",
        [
            "message" => "Unprocessable Content",
            "errors" => $validator->errors()
        ]
    );

$claseId = $request->integer("clase");

$db = ConnectionManager::connection();

$db->update(
    "
        update tbl_clase
        set
            usuario_actualizacion_id = ?,
            fecha_actualizacion = current_timestamp(),
            estado_clase_id = 3
        where status_id = 1 and id = ?
    ",
    [
        Session::get("auth.id"),
        $claseId
    ]
);

ApiResponse::success("Clase cancelada.");