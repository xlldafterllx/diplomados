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

$result = $db->first(
    "
        select
            tg.nombre,
            tg.diplomado_id 'diplomado',
            tg.fecha_inicio,
            tg.hora_inicio,
            tg.tolerancia_antes,
            tg.tolerancia_despues            
        from tbl_grupo tg
        where tg.status_id = 1 and tg.id = ?
    ",
    [
        $grupo
    ]
);

ApiResponse::success($result);