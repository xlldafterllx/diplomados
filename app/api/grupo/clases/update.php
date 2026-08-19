<?php
require_once "../../../../bootstrap.php";

ExceptionHandler::register();
$request = Request::capture();

if (!Session::has("auth.id"))
    ApiResponse::unauthorized("Su sesión ha expirado o no tiene permiso para acceder a este recurso, inicie sesión de nuevo.");

$validator = Validator::make(
    $request,
    [
        "id" => "required|integer",
        "grupo" => "required|integer",
        "fecha" => "required|date",
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

$claseId = $request->integer("id");
$grupoId = $request->integer("grupo");
$fecha = $request->date("fecha")?->format("Y-m-d");

$horaInicio = $request->string("hora-inicio");
$hora = DateTime::createFromFormat("H:i", $horaInicio);
$horaInicio = $hora ? $hora->format("H:i:s") : null;

$tolerancia_antes = $request->integer("tolerancia-antes");
$tolerancia_despues = $request->integer("tolerancia-despues");

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
            cls.hora_inicio = ? and
            cls.id <> ?
    ",
    [
        $grupoId,
        $fecha,
        $horaInicio,
        $claseId
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
            tolerancia_antes = ?,
            tolerancia_despues = ?,
            usuario_actualizacion_id = ?,
            fecha_actualizacion = current_timestamp()
        where status_id = 1 and id = ?
    ",
    [
        $fecha,
        $horaInicio,
        $tolerancia_antes,
        $tolerancia_despues,
        Session::get("auth.id"),
        $claseId
    ]
);

ApiResponse::success("Clase actualizada.");