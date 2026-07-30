<?php
foreach (Config::get("assets.header") as $asset) {
?>
    <link rel="stylesheet" href="<?= asset($asset) ?>">
<?php
}

foreach ($page["assets"]["header"] as $asset) {
?>
    <link rel="stylesheet" href="<?= asset($asset) ?>">
<?php
}
?>