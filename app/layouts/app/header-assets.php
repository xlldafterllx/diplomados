<?php
foreach (Config::get("assets.header") as $asset) {
?>
    <link rel="stylesheet" href="<?= BASE_URL ?>assets/<?= $asset ?>">
<?php
}
?>