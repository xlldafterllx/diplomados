<?php
foreach ($view["assets"]["footer"] as $asset) {
?>
    <script src="<?= BASE_URL ?>assets/<?= $asset ?>"></script>
<?php
}
?>