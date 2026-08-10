<?php
require_once "../../../bootstrap.php";

ExceptionHandler::register();
$request = Request::capture();

$validator = Validator::make(
    $request,
    [
        "token" => "required|string"
    ]
);

if ($validator->fails())
    ApiResponse::unprocessableContent(
        "No se envió el identificador del grupo",
        [
            "message" => "Unprocessable Content",
            "errors" => $validator->errors()
        ]
    );

$token = $request->string("token");

$db = ConnectionManager::connection();

$detalle = $db->first(
    "
        select
            gpo.nombre 'grupo_nombre',
            td.nombre 'diplomado_nombre'
        from tbl_grupo gpo
        inner join tbl_diplomado td on
            gpo.diplomado_id = td.id
        where gpo.status_id = 1 and gpo.token = ?
    ",
    [
        $token
    ]
);

if (!$detalle)
    ApiResponse::notFound("El grupo no existe.");

ApiResponse::success($detalle);