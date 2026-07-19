<?php require_once "header.php"; ?>

<body class="<?= implode(" ", Config::get("app.body_classes")); ?>">
    <div class="app-wrapper">

        <?php require_once "navbar.php"; ?>

        <?php require_once "sidebar.php"; ?>

        <main id="view-content" class="app-main">

            <!-- Aquí se insertarán las vistas -->

        </main>

        <?php require_once "footer.php"; ?>

    </div>
</body>

</html>