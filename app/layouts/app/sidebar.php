<aside class="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
    <div class="sidebar-brand sidebar-brand-fix">
        <a href="#" class="brand-link logo-switch" data-view="dashboard/index">
            <p class="d-none">Dashboard</p>
            <img src="<?= BASE_URL ?>assets/img/logo.png" alt="Logo" class="brand-image opacity-75 sidebar-image">
            <span class="brand-text fw-light brand-text-fix">Gestión de diplomados</span>
        </a>
    </div>

    <div class="sidebar-wrapper">
        <nav class="mt-2">
            <ul class="nav sidebar-menu flex-column flex-column nav-indent" data-lte-toggle="treeview" role="menu">

                <?php if (Session::get("auth.role_id") == 1 || Session::get("auth.role_id") == 2) { ?>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="nav-icon fa-solid fa-book"></i>
                        <p>Catálogos<i class="nav-arrow fas fa-angle-left"></i></p>
                    </a>
                    <ul class="nav nav-treeview">
                        <li class="nav-item">
                            <a href="#" class="nav-link" data-view="diplomados/index">
                                <i class="nav-icon fa-solid fa-chalkboard"></i>
                                <p>Diplomados</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link" data-view="modulos/index">
                                <i class="nav-icon fa-regular fa-folder-open"></i>
                                <p>Módulos</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link" data-view="actividades/index">
                                <i class="nav-icon fa-regular fa-file"></i>
                                <p>Actividades</p>
                            </a>
                        </li>
                    </ul>
                </li>
                <?php } ?>

            </ul>
        </nav>
    </div>
</aside>