<?php
require_once "../../../bootstrap.php";

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

$detalle = $db->first(
    "
        select
            gpo.id,
            gpo.token,
            gpo.nombre 'grupo_nombre',
            td.nombre 'diplomado_nombre',
            count(gpo_alm.id) 'alumnos',
            gpo.fecha_inicio,
            gpo.hora_inicio,
            gpo.tolerancia_antes,
            gpo.tolerancia_despues,
            gpo.fecha_creacion,
            concat(tu.nombre, ' ', tu.apellido_1, ' ', tu.apellido_2) 'usuario_creacion'
        from tbl_grupo gpo
        inner join tbl_diplomado td on
            gpo.diplomado_id = td.id
        inner join tbl_usuarios tu on
            td.usuario_creacion_id = tu.id
        left join rel_grupo_alumno gpo_alm on
        	gpo.id = gpo_alm.grupo_id and gpo_alm.status_id = 1
        where gpo.status_id = 1 and gpo.id = ?
        group by gpo.id
    ",
    [
        $grupo
    ]
);
$detalle["asistencia_url"] = FULL_URL . "check?t=" . $detalle["token"];

ApiResponse::success($detalle);