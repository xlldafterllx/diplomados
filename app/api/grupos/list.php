<?php
require_once "../../../bootstrap.php";

ExceptionHandler::register();

if (!Session::has("auth.id"))
    ApiResponse::unauthorized("Su sesión ha expirado o no tiene permiso para acceder a este recurso, inicie sesión de nuevo.");

$db = ConnectionManager::connection();

$grupos = $db->select(
    "
        select
            tg.id,
            tg.nombre 'grupo_nombre',
            td.nombre 'diplomado_nombre',
            tg.fecha_inicio,
            tg.hora_inicio,
	        tg.fecha_creacion,
            concat(tu.nombre, ' ', tu.apellido_1, ' ', tu.apellido_2) 'usuario_creacion'
        from tbl_grupo tg
        inner join tbl_diplomado td on
            tg.diplomado_id = td.id
        inner join tbl_usuarios tu on
            td.usuario_creacion_id = tu.id
        where tg.status_id = 1
    ",
    []
);

ApiResponse::success($grupos);