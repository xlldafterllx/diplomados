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
        "nombre" => "required|string",
        "apellido-1" => "required|string",
        "apellido-2" => "nullable|string",
        "correo" => "required|email",
        "institucion" => "required|string"
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

$alumnoId = $request->integer("id");
$nombre = $request->string("nombre");
$apellido1 = $request->string("apellido-1");
$apellido2 = $request->string("apellido-2");
$correo = $request->string("correo");
$institucion = $request->string("institucion");

$db = ConnectionManager::connection();

$exist = $db->value(
    "
            select
                alm.id
            from tbl_alumno alm
            where 
                alm.status_id = 1 and
                alm.id <> ? and
                alm.correo = ?
        ",
    [
        $alumnoId,
        $correo
    ]
);

if ($exist)
    ApiResponse::conflict("Ya existe un alumno registrado con el mismo correo electrónico.");

$db->update(
    "
        update tbl_alumno
        set
            nombre = ?,
            apellido_1 = ?,
            apellido_2 = ?,
            correo = ?,
            institucion = ?,
            fecha_actualizacion = current_timestamp(),
            usuario_actualizacion_id = ?
        where status_id = 1 and id = ?
    ",
    [
        $nombre,
        $apellido1,
        $apellido2,
        $correo,
        $institucion,
        Session::get("auth.id"),
        $alumnoId
    ]
);

ApiResponse::success("Alumno actualizado.");