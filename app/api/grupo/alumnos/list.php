<?php
require_once "../../../../bootstrap.php";

ExceptionHandler::register();
$request = Request::capture();

if (!Session::has("auth.id"))
    ApiResponse::unauthorized("Su sesión ha expirado o no tiene permiso para acceder a este recurso, inicie sesión de nuevo.");

$validator = Validator::make(
    $request,
    [
        "grupo" => "required|integer"
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

$grupo = $request->integer("grupo");

$db = ConnectionManager::connection();

$alumnos = $db->select(
    "
        select
            alm.id,
            alm.nombre,
            alm.apellido_1,
            alm.apellido_2,
            alm.correo,
            alm.institucion,
            usr.nombre 'user_nombre',
            usr.apellido_1 'user_apellido_1',
            usr.apellido_2 'user_apellido_2',
            gpo.fecha_creacion 'inscrito'
        from tbl_alumno alm
        inner join rel_grupo_alumno gpo on
            alm.id = gpo.alumno_id
        inner join tbl_usuarios usr on
            alm.usuario_creacion_id = usr.id
        where gpo.status_id = 1 and gpo.grupo_id = ?
    ",
    [
        $grupo
    ]
);

ApiResponse::success($alumnos);