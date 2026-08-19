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
        "fecha-inicio" => "required|date",
        "hora-inicio" => "required|string",
        "tolerancia-antes" => "nullabe|integer",
        "tolerancia-despues" => "nullabe|integer"
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
$fechaInicio = $request->date("fecha-inicio");

$horaInicio = $request->string("hora-inicio");
$hora = DateTime::createFromFormat("H:i", $horaInicio);
$horaInicio = $hora ? $hora->format("H:i:s") : null;

$tolerancia_antes = $request->integer("tolerancia-antes");
$tolerancia_despues = $request->integer("tolerancia-despues");

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
            tg.nombre = ? and 
            tg.diplomado_id = ? 
    ",
    [
        $nombre,
        $diplomado
    ]
);

if ($grupo)
    ApiResponse::conflict("Ya existe un grupo con el mismo nombre y diplomado.", [
        "grupo_nombre" => $grupo["grupo_nombre"],
        "diplomado_nombre" => $grupo["diplomado_nombre"],
    ]);

$token = TokenHelper::generate();

$grupoId = $db->insert(
    "
        insert into tbl_grupo (
            nombre,
            diplomado_id,
            fecha_inicio,
            hora_inicio,
            tolerancia_antes,
            tolerancia_despues,
            token,
            usuario_creacion_id
        ) values (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
        )
    ",
    [
        $nombre,
        $diplomado,
        $fechaInicio?->format("Y-m-d"),
        $horaInicio,
        $tolerancia_antes,
        $tolerancia_despues,
        $token,
        Session::get("auth.id")
    ]
);

ApiResponse::created($grupoId);