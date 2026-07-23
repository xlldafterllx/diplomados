<?php
require_once "bootstrap.php";

$page = [
    "title" => "Alumnos",
    "current" => "alumnos",
    "content" => VIEWS_PATH . "/alumnos/index.php",
    "assets" => [
        "header" => [],
        "footer" => [
            "app/views/alumnos/js/index.js"
        ]
    ]
];

require LAYOUTS_PATH . "/app/layout.php";