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

$nombre = $request->string("nombre");
$diplomado = $request->integer("diplomado");
$modulo = $request->integer("modulo");

$db = ConnectionManager::connection();

$exist = $db->first(
    "
        select
            tm.id,
            tm.nombre
        from tbl_modulo tm
        where
            tm.status_id = 1 and
            tm.id <> ? and
            tm.diplomado_id = ? and
            tm.nombre = ?
    ",
    [
        $modulo,
        $diplomado,
        $nombre
    ]
);

if ($exist)
    ApiResponse::conflict("Ya existe un módulo con el mismo nombre.", [
        "id" => $exist["id"],
        "nombre" => $exist["nombre"]
    ]);

$db->update(
    "
    update tbl_modulo tm
    set
        nombre = ?,
        usuario_actualizacion_id = ?,
        fecha_actualizacion = current_timestamp()
    where tm.status_id = 1 and tm.diplomado_id = ? and tm.id = ?
    ",
    [
        $nombre,
        Session::get("auth.id"),
        $diplomado,
        $modulo
    ]
);

ApiResponse::success();