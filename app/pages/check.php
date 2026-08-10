<?php
require_once "bootstrap.php";

$page = [
    "title" => "Iniciar sesión",
    "content" => VIEWS_PATH . "/check/index.php",
    "assets" => [
        "header" => [
            "assets/vendor/bootstrap/css/bootstrap.min.css",
            "assets/vendor/fontawesome/css/all.min.css",
            "assets/vendor/sweetalert2/css/sweetalert2.min.css",
            "app/views/check/css/index.css"
        ],
        "footer" => [
            "assets/vendor/jquery/js/jquery.min.js",
            "assets/vendor/bootstrap/js/bootstrap.bundle.min.js",
            "assets/vendor/sweetalert2/js/sweetalert2.all.min.js",
            "assets/js/classes/ComponentHelper.js",
            "assets/js/classes/HttpClient.js",
            "assets/js/classes/HttpException.js",
            "assets/js/helpers/theme.js",
            "assets/js/helpers/toast.js",
            "app/views/check/js/index.js"
        ]
    ]
];

require_once LAYOUTS_PATH . "/guest/layout.php";
?>

<Script>
    const TOKEN = "<?= $_GET["t"] ?>";
</Script>