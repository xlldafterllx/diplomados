<?php
foreach (Config::get("assets.header") as $asset) {
?>
    <link rel="stylesheet" href="<?= BASE_URL . $asset ?>">
<?php
}


foreach ($page["assets"]["header"] as $asset) {
?>
    <link rel="stylesheet" href="<?= BASE_URL . $asset ?>">
<?php
}
?>