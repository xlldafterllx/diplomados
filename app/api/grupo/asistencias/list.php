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

//#when timestamp(cls.fecha, '23:59:59') > now()

$asistencias = $db->select(
    "
        select
            alm.id as alumno_id,
            concat_ws(' ', alm.nombre, alm.apellido_1, alm.apellido_2) as alumno,
            cls.id as clase_id,
            cls.fecha,
            asi.fecha_hora,
            case
                when cls.estado_clase_id in (3)
                    then 'NO_APLICA'
                when asi.id is not null
                    then 'ASISTENCIA'
                when jus.id is not null
                    then 'JUSTIFICADA'
                when date_add(timestamp(cls.fecha, cls.hora_inicio), interval coalesce(cls.tolerancia_despues, 0) minute) > now()                
                    then 'PENDIENTE'
                else 'FALTA'
            end as estado
        from rel_grupo_alumno gpoalm
        inner join tbl_alumno alm on 
            alm.id = gpoalm.alumno_id and
            alm.status_id = 1
        inner join tbl_clase cls on 
            cls.grupo_id = gpoalm.grupo_id and
            cls.status_id = 1
        left join tbl_asistencia asi on 
            asi.alumno_id = alm.id and
            asi.clase_id = cls.id and
            asi.status_id = 1
        left join tbl_justificacion jus on 
            jus.alumno_id = alm.id and
            jus.clase_id = cls.id and
            jus.status_id = 1
        where
            gpoalm.grupo_id = ? and
            gpoalm.status_id = 1
        order by
            alm.id,
            cls.fecha;
    ",
    [
        $grupo
    ]
);
$asistenciasFormated = asistenciasFormatter($asistencias);

ApiResponse::success($asistenciasFormated);
function asistenciasFormatter($asistencias)
{
    $clases = [];
    $alumnos = [];
    $totalesClases = [];

    foreach ($asistencias as $row) {
        $alumnoId = (int) $row["alumno_id"];
        $claseId = (int) $row["clase_id"];

        // ---------------------------------------------------------
        // Clases
        // ---------------------------------------------------------
        if (!isset($clases[$claseId])) {
            $clases[$claseId] = [
                "id" => $claseId,
                "fecha" => $row["fecha"],
                "estado" => $row["estado_clase"] ?? null
            ];

            $totalesClases[$claseId] = [
                "asistencias" => 0,
                "faltas" => 0,
                "justificadas" => 0
            ];
        }

        // ---------------------------------------------------------
        // Alumnos
        // ---------------------------------------------------------
        if (!isset($alumnos[$alumnoId])) {
            $alumnos[$alumnoId] = [
                "id" => $alumnoId,
                "alumno" => $row["alumno"],
                "clases" => [],
                "asistencias" => 0,
                "faltas" => 0,
                "justificadas" => 0,
                "promedio" => 0
            ];
        }

        // ---------------------------------------------------------
        // Estado de la clase
        // ---------------------------------------------------------
        $hora = null;

        if (
            $row["estado"] === "ASISTENCIA" &&
            !empty($row["fecha_hora"])
        ) {
            $hora = date(
                "H:i:s",
                strtotime($row["fecha_hora"])
            );
        }

        $alumnos[$alumnoId]["clases"][$claseId] = [
            "estado" => $row["estado"],
            "hora" => $hora
        ];

        // ---------------------------------------------------------
        // Contadores
        // ---------------------------------------------------------
        switch ($row["estado"]) {
            case "ASISTENCIA":
                $alumnos[$alumnoId]["asistencias"]++;
                $totalesClases[$claseId]["asistencias"]++;
                break;

            case "FALTA":
                $alumnos[$alumnoId]["faltas"]++;
                $totalesClases[$claseId]["faltas"]++;
                break;

            case "JUSTIFICADA":
                $alumnos[$alumnoId]["justificadas"]++;
                $totalesClases[$claseId]["justificadas"]++;
                break;
        }
    }

    foreach ($alumnos as &$alumno) {

        $clasesContabilizadas =
            $alumno["asistencias"] +
            $alumno["faltas"] +
            $alumno["justificadas"];

        if ($clasesContabilizadas > 0) {

            $clasesAcreditadas =
                $alumno["asistencias"] +
                $alumno["justificadas"];

            $alumno["promedio"] = round(
                ($clasesAcreditadas / $clasesContabilizadas) * 10,
                1
            );
        }
    }

    unset($alumno);

    $totales = [
        "clases" => $totalesClases,
        "asistencias" => 0,
        "faltas" => 0,
        "justificadas" => 0,
        "promedio" => 0
    ];

    $sumaPromedios = 0;

    foreach ($alumnos as $alumno) {

        $totales["asistencias"] += $alumno["asistencias"];
        $totales["faltas"] += $alumno["faltas"];
        $totales["justificadas"] += $alumno["justificadas"];

        $sumaPromedios += $alumno["promedio"];
    }

    if (count($alumnos) > 0) {
        $totales["promedio"] = round(
            $sumaPromedios / count($alumnos),
            1
        );
    }

    return [
        "clases" => array_values($clases),
        "alumnos" => array_values($alumnos),
        "totales" => $totales
    ];
}