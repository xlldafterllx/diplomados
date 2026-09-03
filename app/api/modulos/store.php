<?php
require_once "../../../bootstrap.php";

ExceptionHandler::register();
$request = Request::capture();

if (!Session::has("auth.id"))
    ApiResponse::unauthorized("Su sesión ha expirado o no tiene permiso para acceder a este recurso, inicie sesión de nuevo.");

$validator = Validator::make(
    $request,
    [
        "nombre" => "required|string",
        "diplomado" => "required|integer",
    ]
);

if ($validator->fails())
    ApiResponse::unprocessableContent(
        array_values($validator->errors())[0][0],
        [
            "message" => "Unprocessable Content",
            "errors" => $validator->errors()
        ]
    );

$nombre = $request->string("nombre");
$diplomado = $request->integer("diplomado");

$db = ConnectionManager::connection();

$exist = $db->first(
    "
        select
            tm.id,
            tm.nombre
        from tbl_modulo tm
        where
            tm.status_id = 1 and
            tm.diplomado_id = ? and
            tm.nombre = ?;
    ",
    [
        $diplomado,
        $nombre
    ]
);

if ($exist) {
    $msg = "Ya existe un módulo con el mismo nombre.";

    AuditLogger::log(
        $db,
        action: "modulo.create",
        entity: "modulo",
        entityId: null,
        data: [
            "mensaje" => $msg,
            "id" => $exist["id"],
            "nombre" => $exist["nombre"]
        ],
        result: "rejected"
    );

    ApiResponse::conflict($msg);
}

$last = $db->value(
    "
        select
            tm.orden
        from tbl_modulo tm
        where tm.diplomado_id = ?
        order by orden desc
        limit 1;
    ",
    [
        $diplomado
    ]
);

$last = $last ? $last += 1 : 1;

$db->transaction(function (Connection $db) use ($nombre, $diplomado, $last) {
    $id = $db->insert(
        "
            insert into tbl_modulo
            (
                nombre,
                diplomado_id,
                orden,
                usuario_creacion_id
            ) values (
                ?, ?, ?, ?
            );
        ",
        [
            $nombre,
            $diplomado,
            $last,
            Session::get("auth.id")
        ]
    );

    AuditLogger::log(
        $db,
        action: "modulo.create",
        entity: "modulo",
        entityId: $id,
        data: [
            "nombre" => $nombre,
            "diplomado" => $diplomado,
            "last" => $last
        ],
        result: "success"
    );
});

ApiResponse::created(null, "Módulo creado.");