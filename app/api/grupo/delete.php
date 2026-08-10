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

$grupoId = $db->insert(
    "
        update tbl_grupo tg 
        set 
            status_id = -1,
            usuario_eliminacion_id = ?,
            fecha_eliminacion = current_timestamp()
        where tg.status_id = 1 and tg.id = ?
    ",
    [
        Session::get("auth.id"),
        $grupo
    ]
);

ApiResponse::created($grupoId);