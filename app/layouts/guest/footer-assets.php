<?php
foreach ($page["assets"]["footer"] as $asset) {
?>
    <script src="<?= asset($asset) ?>"></script>
<?php
}
?>