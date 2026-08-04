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
        "fecha-inicio" => "required|date",
        "hora-inicio" => "required|string",
        "clases" => "required|integer",
        "dia" => "required|integer",
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

$db = ConnectionManager::connection();

$nombre = $request->string("nombre");
$diplomado = $request->integer("diplomado");

$grupo = $db->first(
    "
        select
            tg.nombre 'grupo_nombre',
            td.nombre 'diplomado_nombre'
        from tbl_grupo tg
        inner join tbl_diplomado td on
            tg.diplomado_id = td.id
        where 
            tg.status = 1 and 
            tg.nombre = ? and 
            tg.diplomado_id = ? 
    ",
    [
        $nombre,
        $diplomado
    ]
);

if ($grupo)
    ApiResponse::conflict("Ya existe un grupo con el mismo nombre y diplomado.", [
        "grupo_nombre" => $grupo["grupo_nombre"],
        "diplomado_nombre" => $grupo["diplomado_nombre"],
    ]);

$data = $db->transaction(function (Connection $db) use ($request) {
    $nombre = $request->string("nombre");
    $diplomado = $request->integer("diplomado");
    $fechaInicio = $request->date("fecha-inicio");
    $horaInicio = $request->string("hora-inicio");
    $clases = $request->integer("clases");
    $dia = $request->integer("dia");

    if ($clases < 1 || $clases > 100)
        ApiResponse::unprocessableContent("La cantidad de clases de ser un valor entre 1 y 100.");

    $data = array();

    $grupoId = $db->insert(
        "
            insert into tbl_grupo (
                nombre,
                diplomado_id,
                fecha_inicio,
                hora_inicio,
                numero_clases,
                dia_semana_id,
                usuario_creacion_id
            ) values (
                ?, ?, ?, ?, ?, ?, ?
            )
        ",
        [
            $nombre,
            $diplomado,
            $fechaInicio?->format("Y-m-d"),
            $horaInicio,
            $clases,
            $dia,
            Session::get("auth.id")
        ]
    );

    $data["grupo_id"] = $grupoId;

    $fechaClase = DateTime::createFromImmutable($fechaInicio);

    for ($i = 0; $i < $clases; $i++) {
        $data["clases"][] = $db->insert(
            "
                insert into tbl_clase (
                    grupo_id,
                    fecha,
                    hora_inicio,
                    usuario_creacion_id
                ) values (
                    ?, ?, ?, ?
                )
            ",
            [
                $grupoId,
                $fechaClase?->format("Y-m-d"),
                $horaInicio,
                Session::get("auth.id")
            ]
        );

        $fechaClase->modify("+7 days");
    }

    return $data;
});

ApiResponse::created($data);