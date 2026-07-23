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
        "Uno o varios campos no cumplen con el formato correspondiente",
        [
            "message" => "Unprocessable Content",
            "errors" => $validator->errors()
        ]
    );

$diplomado = $request->integer("diplomado");
$modulo = $request->integer("modulo");

$db = ConnectionManager::connection();

$db->update(
    "
    update tbl_modulo tm
    set
        status = -1
    where tm.status = 1 and tm.diplomado_id = ? and tm.id = ?
    ",
    [
        $diplomado,
        $modulo
    ]
);

ApiResponse::success();