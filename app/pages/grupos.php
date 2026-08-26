<?php
require_once "bootstrap.php";

$page = [
    "title" => "Grupos",
    "current" => "grupos",
    "content" => VIEWS_PATH . "/grupos/index.php",
    "assets" => [
        "header" => [
            ...Config::get("assets.header-datatables"),
            "app/views/grupos/css/index.css"
        ],
        "footer" => [
            ...Config::get("assets.footer-datatables"),
            "app/views/grupos/js/grupos.js",
            "app/views/grupos/js/alumnos.js",
            "app/views/grupos/js/clases.js",
            "app/views/grupos/js/asistencias.js",
            "app/views/grupos/js/index.js"
        ]
    ]
];

require_once LAYOUTS_PATH . "/app/layout.php";
require_once VIEWS_PATH . "/grupos/partials/modals/alumno.php";
require_once VIEWS_PATH . "/grupos/partials/modals/grupo.php";
require_once VIEWS_PATH . "/grupos/partials/modals/asisJustificar.php";
require_once VIEWS_PATH . "/grupos/partials/modals/claseCrear.php";
require_once VIEWS_PATH . "/grupos/partials/modals/claseEditar.php";