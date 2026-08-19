<?php
require_once "../../../bootstrap.php";

ExceptionHandler::register();
$request = Request::capture();

$validator = Validator::make(
    $request,
    [
        "token" => "required|string",
        "correo" => "required|email"
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

$token = $request->string("token");
$correo = $request->string("correo");

$db = ConnectionManager::connection();

$grupoId = $db->value(
    "
        select
            gpo.id
        from tbl_grupo gpo
        where 
            gpo.status_id = 1 and 
            gpo.token = ?
    ",
    [
        $token
    ]
);

if (!$grupoId)
    ApiResponse::notFound("El grupo no existe.");

$alumnoId = $db->value(
    "
        select
            alm.id
        from rel_grupo_alumno gpoalm
        inner join tbl_alumno alm on
            gpoalm.alumno_id = alm.id
        where 
            gpoalm.status_id = 1 and 
            gpoalm.grupo_id = ? and 
            alm.correo = ?
    ",
    [
        $grupoId,
        $correo
    ]
);

if (!$alumnoId)
    ApiResponse::notFound("No estás inscrito a este grupo.");

$clase = $db->first(
    "
        select
            cls.id,
            cls.hora_inicio,
            cls.tolerancia_antes,
            cls.tolerancia_despues
        from tbl_clase cls 
        where 
            cls.status_id = 1 and
            cls.estado_clase_id = 1 and
            date(cls.fecha) = curdate() and
            cls.grupo_id = ?
    ",
    [
        $grupoId
    ]
);

if (!$clase)
    ApiResponse::notFound("Hoy no hay clase disponible para registrar asistencia.");

$asistencia = $db->value(
    "
        select 
            asis.id
        from tbl_asistencia asis
        where asis.status_id = 1 and
        asis.alumno_id = ? and
        asis.clase_id = ?
    ",
    [
        $alumnoId,
        $clase["id"]
    ]
);

if ($asistencia)
    ApiResponse::conflict("Tu asistencia ya fue registrada.");

$claseId = $db->value(
    "
        select
            cls.id
        from tbl_clase cls
        where cls.grupo_id = ?
        and cls.fecha = curdate()
        and (
            cls.tolerancia_antes is null
            or now() >= date_sub(timestamp(cls.fecha, cls.hora_inicio), interval cls.tolerancia_antes minute)
        )
        and (
            cls.tolerancia_despues is null
            or now() <= date_add(timestamp(cls.fecha, cls.hora_inicio), interval cls.tolerancia_despues minute)
        );
    ",
    [
        $grupoId
    ]
);

if (!$claseId) {
    $antes = $clase["tolerancia_antes"] ? $clase["tolerancia_antes"] . " minutos antes" : "";
    $despues = $clase["tolerancia_despues"] ? $clase["tolerancia_despues"] . " minutos después" : "";

    $conector = $antes && $despues ? " y " : "";

    $msg = "Tu asistencia no será registrada ya que la tolerancia para tomar asistencia es de " .
        $antes . $conector . $despues . " de iniciar la clase.";

    ApiResponse::serverError($msg);
}

$ip = $_SERVER["REMOTE_ADDR"] ?? null;
$userAgent = $_SERVER["HTTP_USER_AGENT"] ?? null;

$db->insert(
    "
        insert into tbl_asistencia (
            alumno_id,
            clase_id,
            fecha_hora,
            ip,
            user_agent
        ) values (
            ?,
            ?,
            current_timestamp(),
            ?,
            ?
        ) on duplicate key update
            fecha_hora = current_timestamp(),
            ip = ?,
            user_agent = ?,
            status_id = 1
    ",
    [
        $alumnoId,
        $claseId,
        $ip,
        $userAgent,
        $ip,
        $userAgent
    ]
);

ApiResponse::success("Asistencia registrada");

function checkLog($request, $msg)
{
    $db = ConnectionManager::connection();

    $db->insert("");
}