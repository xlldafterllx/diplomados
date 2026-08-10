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
    ]
);

if ($validator->fails())
    ApiResponse::unprocessableContent(
        "No se envió el identificador del grupo",
        [
            "message" => "Unprocessable Content",
            "errors" => $validator->errors()
        ]
    );

$grupo = $request->string("grupo");

$db = ConnectionManager::connection();

$alumnos = $db->select(
    "
        select
            alm.id,
            concat_ws(' ', alm.nombre, alm.apellido_1, alm.apellido_2 ) 'text'
        from tbl_alumno alm
        inner join rel_grupo_alumno gpoalm on
            alm.id = gpoalm.alumno_id
        where 
            gpoalm.status_id = 1 and 
            alm.status_id = 1 and
            gpoalm.grupo_id = ?
        order by text asc
    ",
    [
        $grupo
    ]
);

$clases = $db->select(
    "
        select
            cls.id,
            date_format(cls.fecha, '%d/%m/%Y') 'text'
        from tbl_clase cls
        where 
            cls.status_id = 1 and 
            cls.grupo_id = ?
        order by cls.fecha asc
    ",
    [
        $grupo
    ]
);

ApiResponse::success([
    "alumnos" => $alumnos,
    "clases" => $clases
]);


