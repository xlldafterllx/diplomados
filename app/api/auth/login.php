<?php
require_once "../../../bootstrap.php";

$request = Request::capture();

$validator = Validator::make(
    $request,
    [
        "username" => "required|string",
        "password" => "required|string"
    ]
);

if ($validator->fails()) {
    ApiResponse::unprocessableContent(
        "Los campos usuario y contraseña son obligatorios",
        [
            "message" => "Unprocessable Content",
            "errors" => $validator->errors()
        ]
    );
}

$username = $request->string("username");
$password = $request->string("password");

$db = ConnectionManager::connection();

$user = $db->first(
    "
        select
            tu.id,
            tu.username,
            tu.password,
            tu.nombre,
            tu.apellido_1,
            tu.apellido_2,
            tu.rol_id,
            cr.rol 'rol_des',
            tu.status
        from tbl_usuarios tu
        inner join cat_rol cr on
            tu.rol_id = cr.id
        where tu.username = ?;
    ",
    [
        $username
    ]
);

if (!$user || !password_verify($password, $user["password"]))
    ApiResponse::notFound("El usuario o la contraseña son incorrectos.");

if ($user["status"] != 1)
    ApiResponse::forbidden("Su usuario ha sido inhabilitado, por favor contacte al administrador del sistema.");

Session::regenerate();

Session::set("auth.id", $user["id"]);

Session::set("auth.name", $user["nombre"] . " " . $user["apellido_1"] . " " . $user["apellido_2"]);

Session::set("auth.role_id", $user["rol_id"]);

Session::set("auth.role_des", $user["rol_des"]);

ApiResponse::success("Bienvenido/a {$user['nombre']}.");