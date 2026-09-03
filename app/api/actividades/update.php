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
        "actividad" => "required|integer"
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
$actividad = $request->integer("actividad");

$db = ConnectionManager::connection();

$exist = $db->first(
    "
        select
            ta.id,
            ta.nombre
        from tbl_actividad ta
        where
            ta.status_id = 1 and
            ta.diplomado_id = ? and
            ta.modulo_id = ? and
            ta.id <> ? and
            ta.nombre = ?;
    ",
    [
        $diplomado,
        $modulo,
        $actividad,
        $nombre
    ]
);

if ($exist) {
    $msg = "Ya existe una actividad con el mismo nombre.";

    AuditLogger::log(
        $db,
        action: "actividad.update",
        entity: "actividad",
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
            ta.nombre
        from tbl_actividad ta
        where
            ta.status_id = 1 and
            ta.diplomado_id = ? and
            ta.modulo_id = ? and
            ta.id = ?
    ",
    [
        $diplomado,
        $modulo,
        $actividad
    ]
);

$nuevo = [
    "nombre" => $nombre
];

$cambios = AuditLogger::obtenerCambios($anterior, $nuevo);

$db->transaction(function (Connection $db) use ($diplomado, $modulo, $actividad, $nombre, $cambios) {
    $db->update(
        "
            update tbl_actividad ta
            set
                nombre = ?,
                usuario_actualizacion_id = ?,
                fecha_actualizacion = current_timestamp()
            where ta.status_id = 1 and ta.diplomado_id = ? and ta.modulo_id = ? and ta.id = ?;
        ",
        [
            $nombre,
            Session::get("auth.id"),
            $diplomado,
            $modulo,
            $actividad
        ]
    );

    if (!empty($cambios))
        AuditLogger::log(
            $db,
            action: "actividad.update",
            entity: "actividad",
            entityId: $actividad,
            data: [
                "cambios" => $cambios
            ],
            result: "success"
        );
});

ApiResponse::success(null, "Actividad actualizada.");