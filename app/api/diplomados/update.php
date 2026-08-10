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

$nombre = $request->string("nombre");
$diplomado = $request->integer("diplomado");

$db = ConnectionManager::connection();

$exist = $db->first(
    "
        select
            td.id,
            td.nombre
        from tbl_diplomado td
        where
            td.status_id = 1 and
            td.id <> ? and
            td.nombre = ?
    ",
    [
        $diplomado,
        $nombre
    ]
);

if ($exist)
    ApiResponse::conflict("Ya existe un diplomado con el mismo nombre.", [
        "id" => $exist["id"],
        "nombre" => $exist["nombre"]
    ]);

$db->update(
    "
    update tbl_diplomado td
    set
        nombre = ?,
        usuario_actualizacion_id = ?,
        fecha_actualizacion = current_timestamp()
    where td.status_id = 1 and td.id = ?
    ",
    [
        $nombre,
        Session::get("auth.id"),
        $diplomado
    ]
);

ApiResponse::success();