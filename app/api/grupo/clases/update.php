<?php
require_once "../../../../bootstrap.php";

ExceptionHandler::register();
$request = Request::capture();

if (!Session::has("auth.id"))
    ApiResponse::unauthorized("Su sesión ha expirado o no tiene permiso para acceder a este recurso, inicie sesión de nuevo.");

$validator = Validator::make(
    $request,
    [
        "clase" => "required|integer",
        "grupo" => "required|integer",
        "fecha" => "required|date",
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

$claseId = $request->integer("clase");
$grupoId = $request->integer("grupo");
$fecha = $request->date("fecha")?->format("Y-m-d");
$horaInicio = $request->string("hora-inicio");

$db = ConnectionManager::connection();

$clase = $db->value(
    "
        select 
            cls.id
        from tbl_clase cls
        where 
            cls.status_id = 1 and
            cls.grupo_id = ? and
            cls.fecha = ? and
            cls.hora_inicio = ? 
    ",
    [
        $grupoId,
        $fecha,
        $horaInicio
    ]
);

if ($clase)
    ApiResponse::conflict("Ya existe una clase con la misma fecha y hora.");

$db->update(
    "
        update tbl_clase
        set
            fecha = ?,
            hora_inicio = ?,
            usuario_actualizacion_id = ?,
            fecha_actualizacion = current_timestamp(),
            estado_clase_id = 2
        where status_id = 1 and id = ?
    ",
    [
        $fecha,
        $horaInicio,
        Session::get("auth.id"),
        $claseId
    ]
);

ApiResponse::success("Clase reprogramada con éxito.");