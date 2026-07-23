<?php
require_once "../../../bootstrap.php";

ExceptionHandler::register();

if (!Session::has("auth.id"))
    ApiResponse::unauthorized("Su sesión ha expirado o no tiene permiso para acceder a este recurso, inicie sesión de nuevo.");

$db = ConnectionManager::connection();

$diplomados = $db->select(
    "
        select
            td.id,
            td.nombre,
            td.fecha_creacion,
            concat(tu.nombre, ' ', tu.apellido_1, ' ', tu.apellido_2) 'usuario_creacion'
        from tbl_diplomado td
        inner join tbl_usuarios tu on
            td.usuario_creacion_id = tu.id
        where td.status = 1
    ",
    []
);

ApiResponse::success($diplomados);