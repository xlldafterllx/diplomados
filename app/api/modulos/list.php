<?php
require_once "../../../bootstrap.php";

ExceptionHandler::register();
$request = Request::capture();

if (!Session::has("auth.id"))
    ApiResponse::unauthorized("Su sesión ha expirado o no tiene permiso para acceder a este recurso, inicie sesión de nuevo.");

$validator = Validator::make(
    $request,
    [
        "diplomado" => "required|integer"
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

$diplomado = $request->integer("diplomado");

$db = ConnectionManager::connection();

$modulos = $db->select(
    "
        select
            tm.id,
            tm.diplomado_id,
            tm.nombre,
            tm.fecha_creacion,
            concat(tu.nombre, ' ', tu.apellido_1, ' ', tu.apellido_2) 'usuario_creacion',
            tm.orden
        from tbl_modulo tm
        inner join tbl_usuarios tu on
            tm.usuario_creacion_id = tu.id
        where tm.status = 1 and tm.diplomado_id = ?
    ",
    [
        $diplomado
    ]
);

ApiResponse::success($modulos);