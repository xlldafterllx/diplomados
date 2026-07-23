<?php
foreach ($page["assets"]["footer"] as $asset) {
?>
    <script src="<?= BASE_URL . $asset ?>"></script>
<?php
}
?>