<?php
$view["assets"]["header"][] = "vendor/bootstrap/css/bootstrap.min.css";
$view["assets"]["header"][] = "vendor/fontawesome/css/all.min.css";
$view["assets"]["header"][] = "vendor/sweetalert2/css/sweetalert2.min.css";
$view["assets"]["header"][] = "css/login.css";

$view["assets"]["footer"][] = "vendor/jquery/js/jquery.min.js";
$view["assets"]["footer"][] = "vendor/bootstrap/js/bootstrap.bundle.min.js";
$view["assets"]["footer"][] = "vendor/sweetalert2/js/sweetalert2.all.min.js";
$view["assets"]["footer"][] = "js/classes/ComponentHelper.js";
$view["assets"]["footer"][] = "js/classes/HttpClient.js";
$view["assets"]["footer"][] = "js/classes/HttpException.js";
$view["assets"]["footer"][] = "js/helpers/toast.js";
$view["assets"]["footer"][] = "js/views/auth/login.js";

?>

<form class="login-box">
    <div class="rounded shadow bg-white p-3 text-color">
        <div class="text-center mt-4">
            <img src="<?= BASE_URL ?>assets/img/logo.png" alt="Logo" class="brand-image opacity-75">
        </div>
        <h3 class="mt-4 text-center upper">
            <?= strtoupper(Config::get("app.name")) ?>
        </h3>
        <div id="login-form" autocomplete="off" class="mt-3 pl-2 pr-2">
            <div class="mb-4">
                <label class="form-label">Usuario</label>
                <input data-field="username" type="text" autocomplete="username" class="form-control">
            </div>
            <div class="mb-4">
                <label class="form-label">Contraseña</label>
                <input data-field="password" type="password" autocomplete="current-password" class="form-control">
            </div>
            <div class="mb-3 text-center">
                <button data-action="login" type="button" class="btn btn-outline-primary"> Iniciar sesión </button>
            </div>
        </div>
    </div>
</form>