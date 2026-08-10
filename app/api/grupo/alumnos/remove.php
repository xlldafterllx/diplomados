<?php
require_once "../../../../bootstrap.php";

ExceptionHandler::register();
$request = Request::capture();

if (!Session::has("auth.id"))
    ApiResponse::unauthorized("Su sesión ha expirado o no tiene permiso para acceder a este recurso, inicie sesión de nuevo.");

$validator = Validator::make(
    $request,
    [
        "grupo" => "required|integer",
        "alumno" => "required|integer"
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

$db = ConnectionManager::connection();

$alumnoId = $request->integer("alumno");
$grupoId = $request->integer("grupo");

$db = ConnectionManager::connection();

$db->update(
    "
        update rel_grupo_alumno
        set
            status_id = -1,
            fecha_eliminacion = current_timestamp(),
            usuario_eliminacion_id = ?
        where 
            status_id = 1 and
            grupo_id = ? and
            alumno_id = ?
    ",
    [
        Session::get("auth.id"),
        $grupoId,
        $alumnoId
    ]
);

ApiResponse::success("Alumno expulsado del grupo.");