<?php
require_once "bootstrap.php";

$page = [
    "title" => "Grupos",
    "current" => "grupos",
    "content" => VIEWS_PATH . "/grupos/index.php",
    "assets" => [
        "header" => [],
        "footer" => [
            "app/views/grupos/js/index.js"
        ]
    ]
];

require LAYOUTS_PATH . "/app/layout.php";