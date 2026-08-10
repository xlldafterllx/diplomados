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
        "id" => "nullable|integer",
        "nombre" => "required|string",
        "apellido-1" => "required|string",
        "apellido-2" => "nullable|string",
        "correo" => "required|email",
        "institucion" => "required|string",
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
$grupoId = $request->integer("grupo");
$correo = $request->string("correo");

if ($alumnoId) {
    $exist = $db->value(
        "
            select
                gpoalm.id
            from rel_grupo_alumno gpoalm
            where 
                gpoalm.status_id = 1 and
                gpoalm.grupo_id = ? and
                gpoalm.alumno_id = ?
        ",
        [
            $grupoId,
            $alumnoId
        ]
    );

    if ($exist)
        ApiResponse::conflict("El alumno ya está inscrito en este grupo.");
} else {
    $exist = $db->value(
        "
            select
                alm.id
            from tbl_alumno alm
            where 
                alm.status_id = 1 and
                alm.correo = ?
        ",
        [
            $correo
        ]
    );

    if ($exist)
        ApiResponse::conflict("Ya existe un alumno registrado con el mismo correo electrónico. Por favor usa el buscador para ingresar al alumno o verifica que el correo esté bien escrito.");
}

$db->transaction(function (Connection $db) use ($request) {
    $grupoId = $request->integer("grupo");
    $nombre = $request->string("nombre");
    $apellido1 = $request->string("apellido-1");
    $apellido2 = $request->string("apellido-2");
    $correo = $request->string("correo");
    $institucion = $request->string("institucion");

    $alumnoId = $db->insert(
        "
            insert into tbl_alumno (
                nombre,
                apellido_1,
                apellido_2,
                correo,
                institucion,
                usuario_creacion_id
            ) values (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
            ) on duplicate key update
                nombre = ?,
                apellido_1 = ?,
                apellido_2 = ?,
                correo = ?,
                institucion = ?,
                status_id = 1,
                fecha_actualizacion = current_timestamp(),
                usuario_actualizacion_id = ?,
                id = LAST_INSERT_ID(id)
            ",
        [
            $nombre,
            $apellido1,
            $apellido2,
            $correo,
            $institucion,
            Session::get("auth.id"),
            $nombre,
            $apellido1,
            $apellido2,
            $correo,
            $institucion,
            Session::get("auth.id")
        ]
    );

    $db->insert(
        "
            insert into rel_grupo_alumno (
                grupo_id,
                alumno_id,
                usuario_creacion_id
            ) values (
               ?,
               ?,
               ? 
            ) on duplicate key update
                status_id = 1,
                fecha_actualizacion = current_timestamp(),
                usuario_actualizacion_id = ?
        ",
        [
            $grupoId,
            $alumnoId,
            Session::get("auth.id"),
            Session::get("auth.id")
        ]
    );
});

ApiResponse::success("Alumno agregado al grupo.");