<?php
require_once "../../../../bootstrap.php";

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

$clases = $db->select(
    "
        select
            cls.id,
            cls.fecha,
            count(asis.clase_id) 'asistencias',
            cls.hora_inicio,
            cls.tolerancia_antes,
            cls.tolerancia_despues,
            cec.estado
        from tbl_clase cls
        left join tbl_asistencia asis on
        	cls.id = asis.clase_id
    	inner join cat_estado_clase cec on
    		cls.estado_clase_id = cec.id
        where cls.status_id = 1 and cls.grupo_id = ?
        group by cls.id
    ",
    [
        $grupo
    ]
);

ApiResponse::success($clases);