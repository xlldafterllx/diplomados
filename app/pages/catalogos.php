<?php
require_once "bootstrap.php";

$page = [
    "title" => "Catálogos",
    "current" => "catalogos",
    "content" => VIEWS_PATH . "/catalogos/index.php",
    "assets" => [
        "header" => [
            ...Config::get("assets.header-datatables")
        ],
        "footer" => [
            ...Config::get("assets.footer-datatables"),
            "app/views/catalogos/js/index.js"
        ]
    ]
];

require_once LAYOUTS_PATH . "/app/layout.php";
require_once VIEWS_PATH . "/catalogos/partials/modal_generic.php";