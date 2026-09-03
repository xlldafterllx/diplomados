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
        "diplomado" => "required|integer"
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
            td.id,
            td.nombre
        from tbl_diplomado td
        where
            td.status_id = 1 and
            td.id <> ? and
            td.nombre = ?;
    ",
    [
        $diplomado,
        $nombre
    ]
);

if ($exist) {
    $msg = "Ya existe un diplomado con el mismo nombre.";

    AuditLogger::log(
        $db,
        action: "diplomado.update",
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

$anterior = $db->first(
    "
        select
            td.nombre
        from tbl_diplomado td
        where
            td.status_id = 1 and
            td.id = ?
    ",
    [
        $diplomado
    ]
);

$nuevo = [
    "nombre" => $nombre
];

$cambios = AuditLogger::obtenerCambios($anterior, $nuevo);

$db->transaction(function (Connection $db) use ($diplomado, $nombre, $cambios) {
    $db->update(
        "
            update tbl_diplomado td
            set
                nombre = ?,
                usuario_actualizacion_id = ?,
                fecha_actualizacion = current_timestamp()
            where td.status_id = 1 and td.id = ?;
        ",
        [
            $nombre,
            Session::get("auth.id"),
            $diplomado
        ]
    );

    if (!empty($cambios))
        AuditLogger::log(
            $db,
            action: "diplomado.update",
            entity: "diplomado",
            entityId: $diplomado,
            data: [
                "cambios" => $cambios
            ],
            result: "success"
        );
});

ApiResponse::success(null, "Diplomado actualizado.");