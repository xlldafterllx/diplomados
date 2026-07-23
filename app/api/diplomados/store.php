<?php
require_once "../../../bootstrap.php";

ExceptionHandler::register();
$request = Request::capture();

if (!Session::has("auth.id"))
    ApiResponse::unauthorized("Su sesión ha expirado o no tiene permiso para acceder a este recurso, inicie sesión de nuevo.");

$validator = Validator::make(
    $request,
    [
        "nombre" => "required|string",
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

$nombre = $request->string("nombre");

$db = ConnectionManager::connection();

$db->insert(
    "
        insert into tbl_diplomado
        (
            nombre,
            usuario_creacion_id
        )
        values
        (
            ?, ?
        )
    ",
    [
        $nombre,
        Session::get("auth.id")
    ]
);

ApiResponse::created();