<?php
require_once "../../../bootstrap.php";

ExceptionHandler::register();
$request = Request::capture();

if (!Session::has("auth.id"))
    ApiResponse::unauthorized("Su sesión ha expirado o no tiene permiso para acceder a este recurso, inicie sesión de nuevo.");

$validator = Validator::make(
    $request,
    [
        "diplomado" => "required|integer",
        "modulo" => "required|integer"
    ]
);

if ($validator->fails())
    ApiResponse::unprocessableContent(
        "Uno o varios campos no cumplen con el formato correspondiente",
        [
            "message" => "Unprocessable Content",
            "errors" => $validator->errors(),
            "parameters" => $request->all()
        ]
    );

$diplomado = $request->integer("diplomado");
$modulo = $request->integer("modulo");

$db = ConnectionManager::connection();

$actividades = $db->select(
    "
        select
            ta.id,
            ta.diplomado_id,
            ta.modulo_id,
            ta.nombre,
            ta.fecha_creacion,
            concat(tu.nombre, ' ', tu.apellido_1, ' ', tu.apellido_2) 'usuario_creacion',
            ta.orden
        from tbl_actividad ta
        inner join tbl_usuarios tu on
            ta.usuario_creacion_id = tu.id
        where ta.status = 1 and ta.diplomado_id = ? and ta.modulo_id = ?
    ",
    [
        $diplomado,
        $modulo
    ]
);

ApiResponse::success($actividades);