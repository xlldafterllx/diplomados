<?php
require_once "bootstrap.php";

Session::destroy();

Response::redirect(BASE_URL);