<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>
        <?= Config::get("app.name") ?>
    </title>

    <link rel="shortcut icon" type="image/x-icon" href="<?= BASE_URL ?>/assets/img/logo.png" />

    <?php require_once "header-assets.php"; ?>

    <Script>
        const BASE_URL = "<?= BASE_URL ?>";
    </Script>
</head>