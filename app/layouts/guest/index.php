<?php

ob_start();

require_once VIEWS_PATH . "/auth/login.php";

$content = ob_get_clean();

require_once "header.php";

?>

<body>

    <?= $content ?>

</body>

<?php require_once "footer.php"; ?>

</html>