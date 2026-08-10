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
            "app/views/grupos/js/index.js"
        ]
    ]
];

require_once LAYOUTS_PATH . "/app/layout.php";
require_once VIEWS_PATH . "/grupos/partials/modals/alumno.php";
require_once VIEWS_PATH . "/grupos/partials/modals/grupo.php";
require_once VIEWS_PATH . "/grupos/partials/modals/asisJustificar.php";
require_once VIEWS_PATH . "/grupos/partials/modals/claseReprogramar.php";
require_once VIEWS_PATH . "/grupos/partials/modals/claseCrear.php";