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
        "modulo" => "required|integer",
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
$modulo = $request->integer("modulo");

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
            tm.id <> ? and
            tm.nombre = ?;
    ",
    [
        $diplomado,
        $modulo,
        $nombre
    ]
);

if ($exist) {
    $msg = "Ya existe un módulo con el mismo nombre.";

    AuditLogger::log(
        $db,
        action: "modulo.update",
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

$anterior = $db->first(
    "
        select
            tm.nombre
        from tbl_modulo tm
        where
            tm.status_id = 1 and
            tm.diplomado_id = ? and
            tm.id = ?
    ",
    [
        $diplomado,
        $modulo
    ]
);

$nuevo = [
    "nombre" => $nombre
];

$cambios = AuditLogger::obtenerCambios($anterior, $nuevo);

$db->transaction(function (Connection $db) use ($diplomado, $modulo, $nombre, $cambios) {
    $db->update(
        "
            update tbl_modulo tm
            set
                nombre = ?,
                usuario_actualizacion_id = ?,
                fecha_actualizacion = current_timestamp()
            where tm.status_id = 1 and tm.diplomado_id = ? and tm.id = ?;
        ",
        [
            $nombre,
            Session::get("auth.id"),
            $diplomado,
            $modulo
        ]
    );

    if (!empty($cambios))
        AuditLogger::log(
            $db,
            action: "modulo.update",
            entity: "modulo",
            entityId: $modulo,
            data: [
                "cambios" => $cambios
            ],
            result: "success"
        );
});

ApiResponse::success(null, "Módulo actualizado.");