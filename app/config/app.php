<?php

$host = $_SERVER["HTTP_HOST"] ?? "";
$host = strtolower(explode(":", $host)[0]);

$productionHosts = [
    "diplomados.dftrdev.com",
];

$isProduction = in_array($host, $productionHosts, true);

return [    
    /*
    |--------------------------------------------------------------------------
    | APP
    |--------------------------------------------------------------------------
    */

    "name" => "Gestión de diplomados",
    "session_name" => "DIPLOMADOS_SESSION",
    "proyect_name" => "diplomados",
    "version" => "1.0.0",
    "base_url" => $isProduction ? "/" : "/diplomados/",
    "development" => !$isProduction,
    "home" => "dashboard",

    /*
    |--------------------------------------------------------------------------
    | LOCALIZATION
    |--------------------------------------------------------------------------
    */

    "timezone" => "America/Mexico_City",
    "locale" => "es_MX.UTF-8",

    /*
    |--------------------------------------------------------------------------
    | LAYOUT
    |--------------------------------------------------------------------------
    */

    "body_classes" => [
        "layout-fixed",
        "fixed-header",
        "fixed-footer",
        "sidebar-expand-lg",
        "bg-body-tertiary"
    ]
];