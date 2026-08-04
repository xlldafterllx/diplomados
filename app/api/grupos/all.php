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
            cds.dia_semana,
	        tg.fecha_creacion,
            concat(tu.nombre, ' ', tu.apellido_1, ' ', tu.apellido_2) 'usuario_creacion'
        from tbl_grupo tg
        inner join tbl_diplomado td on
            tg.diplomado_id = td.id
        inner join cat_dia_semana cds on
            tg.dia_semana_id = cds.id
        inner join tbl_usuarios tu on
            td.usuario_creacion_id = tu.id
        where tg.status = 1
    ",
    []
);

$diplomados = $db->select(
    "
        select
            td.id 'id',
            td.nombre 'text' 
        from tbl_diplomado td
        where td.status = 1
    ",
    []
);

$dias = $db->select(
    "
        select
            cds.id 'id',
            cds.dia_semana 'text' 
        from cat_dia_semana cds
    ",
    []
);

ApiResponse::success([
    "grupos" => $grupos,
    "catalogos" => [
        "diplomados" => $diplomados,
        "dias" => $dias
    ]
]);