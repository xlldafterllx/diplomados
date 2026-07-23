<?php
/*
|--------------------------------------------------------------------------
| PATHS
|--------------------------------------------------------------------------
*/

define("ROOT_PATH", __DIR__);

define("APP_PATH", ROOT_PATH . "/app");

define("ASSETS_PATH", ROOT_PATH . "/assets");

define("LAYOUTS_PATH", APP_PATH . "/layouts");

define("VIEWS_PATH", APP_PATH . "/views");

define("CONFIG_PATH", APP_PATH . "/config");

define("CORE_PATH", APP_PATH . "/core");

define("PAGES_PATH", APP_PATH . "/pages");

/*
|--------------------------------------------------------------------------
| AUTOLOADER
|--------------------------------------------------------------------------
*/

spl_autoload_register(function ($class) {
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator(
            CORE_PATH
        )
    );

    foreach ($iterator as $file) {
        if ($file->isFile() && $file->getFilename() === "{$class}.php") {
            require_once $file->getPathname();
            return;
        }
    }
});

/*
|--------------------------------------------------------------------------
| SESSION
|--------------------------------------------------------------------------
*/

Session::start();

/*
|--------------------------------------------------------------------------
| EXCEPTION HANDLER
|--------------------------------------------------------------------------
*/

ExceptionHandler::register();

/*
|--------------------------------------------------------------------------
| LOCALIZATION
|--------------------------------------------------------------------------
*/

date_default_timezone_set(Config::get("app.timezone"));

setlocale(LC_TIME, Config::get("app.locale"));

/*
|--------------------------------------------------------------------------
| CONSTANTS
|--------------------------------------------------------------------------
*/

define("APP_NAME", Config::get("app.name"));
define("BASE_URL", Config::get("app.base_url"));
?>