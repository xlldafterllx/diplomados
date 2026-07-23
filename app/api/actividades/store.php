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
        "modulo" => "required|integer"
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

$last = $db->value(
    "
    select
        ta.orden
    from tbl_actividad ta
    where ta.diplomado_id = ? and ta.modulo_id = ?
    order by orden desc
    limit 1
    ",
    [
        $diplomado,
        $modulo
    ]
);

$last = $last ? $last += 1 : 1;

$db->insert(
    "
        insert into tbl_actividad
        (
            nombre,
            diplomado_id,
            modulo_id,
            orden,
            usuario_creacion_id
        )
        values
        (
            ?, ?, ?, ?, ?
        )
    ",
    [
        $nombre,
        $diplomado,
        $modulo,
        $last,
        Session::get("auth.id")
    ]
);

ApiResponse::created();