<?php
require_once "../../../../bootstrap.php";

ExceptionHandler::register();
$request = Request::capture();

if (!Session::has("auth.id"))
    ApiResponse::unauthorized("Su sesión ha expirado o no tiene permiso para acceder a este recurso, inicie sesión de nuevo.");

$validator = Validator::make(
    $request,
    [
        "palabra" => "required|string|min:3"
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

$palabra = "%".$request->string("palabra")."%";

$db = ConnectionManager::connection();

$alumnos = $db->select(
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
            (
                alm.nombre like ? or
                alm.apellido_1 like ? or
                alm.apellido_2 like ? or
                alm.correo like ?
            )
    ",
    [
        $palabra,
        $palabra,
        $palabra,
        $palabra
    ]
);

ApiResponse::success($alumnos);