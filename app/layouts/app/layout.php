<?php require_once "header.php"; ?>

<body class="<?= implode(" ", Config::get("app.body_classes")); ?>">
    <div class="app-wrapper">

        <?php require_once "navbar.php"; ?>

        <?php require_once "sidebar.php"; ?>

        <script src="<?= asset("assets/js/helpers/SidebarPersistence.js") ?>"></script>

        <main id="view-content" class="app-main">

            <div>
                <div class="main-content">
                    <?php require_once $page["content"]; ?>
                </div>
            </div>

        </main>

        <?php require_once "footer.php"; ?>

    </div>
</body>

</html>