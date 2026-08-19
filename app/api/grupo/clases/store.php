<?php
require_once "../../../../bootstrap.php";

ExceptionHandler::register();
$request = Request::capture();

if (!Session::has("auth.id"))
    ApiResponse::unauthorized("Su sesión ha expirado o no tiene permiso para acceder a este recurso, inicie sesión de nuevo.");

$validator = Validator::make(
    $request,
    [
        "id" => "required|integer",
        "fecha-inicio" => "required|date",
        "hora-inicio" => "required|string",
        "tolerancia-antes" => "nullabe|integer",
        "tolerancia-despues" => "nullabe|integer",
        "cantidad" => "required|integer|minValue:1|maxValue:100",
        "cada" => "required|integer|minValue:1|maxValue:50",
        "tiempo" => "required|integer"
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

$db->transaction(function (Connection $db) use ($request) {
    $grupoId = $request->integer("id");
    $fechaInicio = $request->date("fecha-inicio");
    $fechaClase = DateTime::createFromImmutable($fechaInicio);

    $horaInicio = $request->string("hora-inicio");
    $hora = DateTime::createFromFormat("H:i", $horaInicio);
    $horaInicio = $hora ? $hora->format("H:i:s") : null;

    $tolerancia_antes = $request->integer("tolerancia-antes");
    $tolerancia_despues = $request->integer("tolerancia-despues");
    $cantidad = $request->integer("cantidad");
    $cada = $request->integer("cada");
    $tiempo = $request->integer("tiempo");

    $tiempoType = $db->value(
        "
            select
                tmp.type
            from cat_tiempo tmp
            where tmp.id = ?
        ",
        [
            $tiempo
        ]
    );

    for ($i = 0; $i < $cantidad; $i++) {
        $db->insert(
            "
                insert into tbl_clase (
                    grupo_id,
                    fecha,
                    hora_inicio,
                    tolerancia_antes,
                    tolerancia_despues,
                    usuario_creacion_id
                ) values (
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                ) on duplicate key update
                    status_id = 1,
                    tolerancia_antes = ?,
                    tolerancia_despues = ?,
                    fecha_actualizacion = current_timestamp(),
                    usuario_actualizacion_id = ?
            ",
            [
                $grupoId,
                $fechaClase?->format("Y-m-d"),
                $horaInicio,
                $tolerancia_antes,
                $tolerancia_despues,
                Session::get("auth.id"),
                $tolerancia_antes,
                $tolerancia_despues,
                Session::get("auth.id")
            ]
        );

        $fechaClase->modify("+" . $cada . " " . $tiempoType);
    }

});

ApiResponse::created("Clases creadas.");