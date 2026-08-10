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

$nombre = $request->string("nombre");
$diplomado = $request->integer("diplomado");
$modulo = $request->integer("modulo");
$actividad = $request->integer("actividad");

$db = ConnectionManager::connection();

$exist = $db->first(
    "
        select
            ta.id,
            ta.nombre
        from tbl_actividad ta
        where
            ta.status_id = 1 and
            ta.id <> ? and
            ta.diplomado_id = ? and
            ta.modulo_id = ? and
            ta.nombre = ?
    ",
    [
        $actividad,
        $diplomado,
        $modulo,
        $nombre
    ]
);

if ($exist)
    ApiResponse::conflict("Ya existe una actividad con el mismo nombre.", [
        "id" => $exist["id"],
        "nombre" => $exist["nombre"]
    ]);

$db->update(
    "
    update tbl_actividad ta
    set
        nombre = ?,
        usuario_actualizacion_id = ?,
        fecha_actualizacion = current_timestamp()
    where ta.status_id = 1 and ta.diplomado_id = ? and ta.modulo_id = ? and ta.id = ?
    ",
    [
        $nombre,
        Session::get("auth.id"),
        $diplomado,
        $modulo,
        $actividad
    ]
);

ApiResponse::success();