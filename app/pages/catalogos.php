<?php
require_once "bootstrap.php";

$page = [
    "title" => "Catálogos",
    "current" => "catalogos",
    "content" => VIEWS_PATH . "/catalogos/index.php",
    "assets" => [
        "header" => [],
        "footer" => [
            "app/views/catalogos/js/index.js"
        ]
    ]
];

require LAYOUTS_PATH . "/app/layout.php";
require VIEWS_PATH . "/catalogos/partials/modal_generic.php";