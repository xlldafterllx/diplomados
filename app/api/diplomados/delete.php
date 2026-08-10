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
        "Uno o varios campos no cumplen con el formato correspondiente",
        [
            "message" => "Unprocessable Content",
            "errors" => $validator->errors()
        ]
    );

$diplomado = $request->integer("diplomado");

$db = ConnectionManager::connection();

$db->update(
    "
    update tbl_diplomado td
    set
        status_id = -1,
        usuario_eliminacion_id = ?,
        fecha_eliminacion = current_timestamp()
    where td.status_id = 1 and td.id = ?
    ",
    [
        Session::get("auth.id"),
        $diplomado
    ]
);

ApiResponse::success();