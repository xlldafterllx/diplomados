<?php
require_once "bootstrap.php";

$page = [
    "title" => "Iniciar sesión",
    "content" => VIEWS_PATH . "/login/index.php",
    "assets" => [
        "header" => [
            "assets/vendor/bootstrap/css/bootstrap.min.css",
            "assets/vendor/fontawesome/css/all.min.css",
            "assets/vendor/sweetalert2/css/sweetalert2.min.css",
            "assets/css/login.css"
        ],
        "footer" => [
            "assets/vendor/jquery/js/jquery.min.js",
            "assets/vendor/bootstrap/js/bootstrap.bundle.min.js",
            "assets/vendor/sweetalert2/js/sweetalert2.all.min.js",
            "assets/js/classes/ComponentHelper.js",
            "assets/js/classes/HttpClient.js",
            "assets/js/classes/HttpException.js",
            "assets/js/helpers/toast.js",
            "app/views/login/js/index.js"
        ]
    ]
];

require LAYOUTS_PATH . "/guest/layout.php";