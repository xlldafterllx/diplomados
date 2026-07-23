<?php
require_once "bootstrap.php";

$page = [
    "title" => "Dashboard",
    "current" => "dashboard",
    "content" => VIEWS_PATH . "/dashboard/index.php",
    "assets" => [
        "header" => [],
        "footer" => [
            "app/views/dashboard/js/index.js"
        ]
    ]
];

require LAYOUTS_PATH . "/app/layout.php";