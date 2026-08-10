<?php
require_once "../../../bootstrap.php";

ExceptionHandler::register();
$request = Request::capture();

if (!Session::has("auth.id"))
    ApiResponse::unauthorized("Su sesión ha expirado o no tiene permiso para acceder a este recurso, inicie sesión de nuevo.");

$validator = Validator::make(
    $request,
    [
        "id" => "required|integer",
        "nombre" => "required|string",
        "diplomado" => "required|integer",
        "fecha-inicio" => "required|date",
        "hora-inicio" => "required|string"
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

$id = $request->integer("id");
$nombre = $request->string("nombre");
$diplomado = $request->integer("diplomado");
$fechaInicio = $request->date("fecha-inicio");
$horaInicio = $request->string("hora-inicio");

$db = ConnectionManager::connection();

$grupo = $db->first(
    "
        select
            tg.nombre 'grupo_nombre',
            td.nombre 'diplomado_nombre'
        from tbl_grupo tg
        inner join tbl_diplomado td on
            tg.diplomado_id = td.id
        where
            tg.status_id = 1 and 
            tg.id <> ? and
            tg.nombre = ? and 
            tg.diplomado_id = ? 
    ",
    [
        $id,
        $nombre,
        $diplomado
    ]
);

if ($grupo)
    ApiResponse::conflict("Ya existe un grupo con el mismo nombre y diplomado.", [
        "grupo_nombre" => $grupo["grupo_nombre"],
        "diplomado_nombre" => $grupo["diplomado_nombre"],
    ]);

$grupoId = $db->insert(
    "
        update tbl_grupo tg 
        set 
            nombre = ?,
            diplomado_id = ?,
            fecha_inicio = ?,
            hora_inicio = ?,
            usuario_actualizacion_id = ?,
            fecha_actualizacion = current_timestamp()
        where tg.status_id = 1 and tg.id = ?
    ",
    [
        $nombre,
        $diplomado,
        $fechaInicio?->format("Y-m-d"),
        $horaInicio,
        Session::get("auth.id"),
        $id
    ]
);

ApiResponse::created($grupoId);