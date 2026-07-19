<?php
foreach (Config::get("assets.footer") as $asset) {
?>
    <script src="<?= BASE_URL ?>assets/<?= $asset ?>"></script>
<?php
}
?>
<script>
document.addEventListener(
    "DOMContentLoaded",
    () => {
        Theme.init();
        NavigationManager.init();
    }
);
</script>