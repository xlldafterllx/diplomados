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
    ]
);

if ($validator->fails())
    ApiResponse::unprocessableContent(
        "Uno o varios campos no cumplen con el formato correspondiente",
        [
            "hola" => "hola",
            "message" => "Unprocessable Content",
            "errors" => $validator->errors(),
            "data" => $request->all()
        ]
    );

$nombre = $request->string("nombre");
$diplomado = $request->integer("diplomado");

$db = ConnectionManager::connection();

$last = $db->value(
    "
    select
        tm.orden
    from tbl_modulo tm
    where tm.diplomado_id = ?
    order by orden desc
    limit 1
    ",
    [
        $diplomado
    ]
);

$last = $last ? $last += 1 : 1;

$db->insert(
    "
        insert into tbl_modulo
        (
            nombre,
            diplomado_id,
            orden,
            usuario_creacion_id
        )
        values
        (
            ?, ?, ?, ?
        )
    ",
    [
        $nombre,
        $diplomado,
        $last,
        Session::get("auth.id")
    ]
);

ApiResponse::created();