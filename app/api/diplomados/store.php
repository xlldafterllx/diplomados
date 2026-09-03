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

$db = ConnectionManager::connection();

$exist = $db->first(
    "
        select
            td.id,
            td.nombre
        from tbl_diplomado td
        where
            td.status_id = 1 and
            td.nombre = ?;
    ",
    [
        $nombre
    ]
);

if ($exist) {
    $msg = "Ya existe un diplomado con el mismo nombre.";

    AuditLogger::log(
        $db,
        action: "diplomado.create",
        entity: "diplomado",
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

$db->transaction(function (Connection $db) use ($nombre) {
    $id = $db->insert(
        "
            insert into tbl_diplomado
            (
                nombre,
                usuario_creacion_id
            ) values (
                ?, ?
            );
        ",
        [
            $nombre,
            Session::get("auth.id")
        ]
    );

    AuditLogger::log(
        $db,
        action: "diplomado.create",
        entity: "diplomado",
        entityId: $id,
        data: [
            "nombre" => $nombre
        ],
        result: "success"
    );
});

ApiResponse::created(null, "Diplomado creado.");