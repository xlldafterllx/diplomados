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
        "Uno o varios campos no cumplen con el formato correspondiente",
        [
            "message" => "Unprocessable Content",
            "errors" => $validator->errors()
        ]
    );

$diplomado = $request->integer("diplomado");
$modulo = $request->integer("modulo");
$actividad = $request->integer("actividad");

$db = ConnectionManager::connection();

$db->update(
    "
    update tbl_actividad ta
    set
        status = -1
    where ta.status = 1 and ta.diplomado_id = ? and ta.modulo_id = ? and ta.id = ?
    ",
    [
        $diplomado,
        $modulo,
        $actividad
    ]
);

ApiResponse::success();