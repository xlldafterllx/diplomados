<?php
foreach ($view["assets"]["header"] as $asset) {
?>
    <link rel="stylesheet" href="<?= BASE_URL ?>assets/<?= $asset ?>">
<?php
}
?>