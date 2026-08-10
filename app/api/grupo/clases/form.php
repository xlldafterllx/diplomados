<?php
require_once "../../../../bootstrap.php";

ExceptionHandler::register();
$request = Request::capture();

if (!Session::has("auth.id"))
    ApiResponse::unauthorized("Su sesión ha expirado o no tiene permiso para acceder a este recurso, inicie sesión de nuevo.");

$validator = Validator::make(
    $request,
    [
        "clase" => "required|integer"
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

$claseId = $request->integer("clase");

$db = ConnectionManager::connection();

$clase = $db->first(
    "
        select 
            cls.fecha,
            cls.hora_inicio
        from tbl_clase cls
        where 
            cls.status_id = 1 and 
            cls.id = ?
    ",
    [
        $claseId
    ]
);

ApiResponse::success($clase);