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

$db->transaction(function (Connection $db) use ($claseId) {
    $db->update(
        "
        update tbl_clase
        set
            usuario_eliminacion_id = ?,
            fecha_eliminacion = current_timestamp(),
            status_id = -1
        where status_id = 1 and id = ?
        ",
        [
            Session::get("auth.id"),
            $claseId
        ]
    );

    $db->update(
        "
        update tbl_asistencia
        set
            usuario_eliminacion_id = ?,
            fecha_eliminacion = current_timestamp(),
            status_id = -1
        where status_id = 1 and clase_id = ?
        ",
        [
            Session::get("auth.id"),
            $claseId
        ]
    );

    $db->update(
        "
        update tbl_justificacion
        set
            usuario_eliminacion_id = ?,
            fecha_eliminacion = current_timestamp(),
            status_id = -1
        where status_id = 1 and clase_id = ?
        ",
        [
            Session::get("auth.id"),
            $claseId
        ]
    );
});

ApiResponse::success("Clase eliminada con éxito.");