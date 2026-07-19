<?php
require_once "../../../bootstrap.php";

$request = Request::capture();

$view = $request->string("view");

$html = View::render($view);

ApiResponse::success($html);