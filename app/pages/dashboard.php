<?php
require_once "bootstrap.php";

$page = [
    "title" => "Dashboard",
    "current" => "dashboard",
    "content" => VIEWS_PATH . "/dashboard/index.php",
    "assets" => [
        "header" => [
            "app/views/dashboard/css/index.css"
        ],
        "footer" => [
            "app/views/dashboard/js/index.js"
        ]
    ]
];

require_once LAYOUTS_PATH . "/app/layout.php";