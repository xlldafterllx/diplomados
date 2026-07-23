<?php
foreach (Config::get("assets.footer") as $asset) {
?>
    <script src="<?= BASE_URL . $asset ?>"></script>
<?php
}

foreach ($page["assets"]["footer"] as $asset) {
?>
    <script src="<?= BASE_URL . $asset ?>"></script>
<?php
}
?>
<script>
document.addEventListener(
    "DOMContentLoaded",
    () => {
        Theme.init();
    }
);
</script>