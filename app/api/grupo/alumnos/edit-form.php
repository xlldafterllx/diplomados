<?php
require_once "../../../../bootstrap.php";

ExceptionHandler::register();
$request = Request::capture();

if (!Session::has("auth.id"))
    ApiResponse::unauthorized("Su sesión ha expirado o no tiene permiso para acceder a este recurso, inicie sesión de nuevo.");

$validator = Validator::make(
    $request,
    [
        "alumno" => "required|integer"
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

$alumnoId = $request->integer("alumno");

$db = ConnectionManager::connection();

$alumno = $db->first(
    "
        select
            alm.id,
            alm.nombre,
            alm.apellido_1,
            alm.apellido_2,
            alm.correo,
            alm.institucion
        from tbl_alumno alm
        where 
            alm.status_id = 1 and 
            alm.id = ?
    ",
    [
        $alumnoId
    ]
);

ApiResponse::success($alumno);