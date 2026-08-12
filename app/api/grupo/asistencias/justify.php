<?php
require_once "../../../../bootstrap.php";

ExceptionHandler::register();
$request = Request::capture();

if (!Session::has("auth.id"))
    ApiResponse::unauthorized("Su sesión ha expirado o no tiene permiso para acceder a este recurso, inicie sesión de nuevo.");

$validator = Validator::make(
    $request,
    [
        "alumno" => "required|integer",
        "clase" => "required|integer",
        "motivo" => "nullable|string",
    ]
);

if ($validator->fails())
    ApiResponse::unprocessableContent(
        array_values($validator->errors())[0][0],
        [
            "message" => "Unprocessable Content",
            "errors" => $validator->errors()
        ]
    );

$alumno = $request->integer("alumno");
$clase = $request->integer("clase");
$motivo = $request->string("motivo");

$db = ConnectionManager::connection();

$alumnoId = $db->value(
    "
    select 
        alm.id
    from tbl_alumno alm
    where 
        alm.status_id = 1 and 
	    alm.id = ?
    ",
    [
        $alumno
    ]
);

if (!$alumnoId)
    ApiResponse::notFound("El alumno no existe.");

$claseId = $db->value(
    "
    select 
        cls.id
    from tbl_clase cls
    where 
        cls.status_id = 1 and 
	    cls.id = ?
    ",
    [
        $clase
    ]
);

if (!$claseId)
    ApiResponse::notFound("La clase no existe.");

$previa = $db->value(
    "
    select 
        jus.id
    from tbl_justificacion jus
    where 
        jus.alumno_id = ? and
        jus.clase_id = ? and
        jus.status_id = 1
    ",
    [
        $alumno,
        $clase
    ]
);

if ($previa)
    ApiResponse::conflict("Ya existe una justificación para este alumno en la clase seleccionada.");

$db->insert(
    "
        insert into tbl_justificacion (
            alumno_id,
            clase_id,
            motivo,
            usuario_creacion_id
        ) values (
            ?, ?, ?, ?
        ) on duplicate key update
            motivo = ?,
            status_id = 1,
            fecha_actualizacion = current_timestamp(),
            usuario_actualizacion_id = ?
    ",
    [
        $alumno,
        $clase,
        $motivo,
        Session::get("auth.id"),
        $motivo,
        Session::get("auth.id")
    ]
);

ApiResponse::created("Justificación guardada con éxito.");