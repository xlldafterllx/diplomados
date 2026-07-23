<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>
        <?= APP_NAME ?>
    </title>

    <link rel="shortcut icon" type="image/x-icon" href="<?= BASE_URL ?>/assets/img/logo.png" />

    <?php require_once "header-assets.php"; ?>

    <?php require_once "header-theme.php"; ?>

    <Script>
        const APP_NAME = "<?= APP_NAME ?>";
        const BASE_URL = "<?= BASE_URL ?>";
        const API_URL = BASE_URL + "app/api/";
        const TODAY = "<?= date("Y-m-d"); ?>";
    </Script>
</head>