<?php
require_once "bootstrap.php";

if (!Session::has("auth.id")) {
    require_once LAYOUTS_PATH . "/guest/index.php";
    exit;
}

require_once LAYOUTS_PATH . "/app/index.php";