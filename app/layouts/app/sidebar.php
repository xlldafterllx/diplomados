<aside class="app-sidebar bg-body-secondary shadow" data-enable-persistence="true" data-bs-theme="dark">
    <div class="sidebar-brand sidebar-brand-fix">
        <a href="<?= BASE_URL ?>dashboard" class="brand-link">
            <img src="<?= BASE_URL ?>assets/img/logo.png" alt="Logo" class="brand-image opacity-75 sidebar-image">
            <span class="brand-text fw-light brand-text-fix">Gestión de diplomados</span>
        </a>
    </div>

    <div class="sidebar-wrapper">
        <nav class="mt-2">
            <ul class="nav sidebar-menu flex-column nav-indent" data-lte-toggle="treeview" role="menu" data-accordion="false">

                <?php if (Session::get("auth.role_id") == 1 || Session::get("auth.role_id") == 2) { ?>
                    <li class="nav-item">
                        <a href="<?= BASE_URL ?>catalogos"
                            class="nav-link <?= $page["current"] === "catalogos" ? "active" : "" ?>">
                            <i class="nav-icon fa-solid fa-book"></i>
                            <p>Catálogos</p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="<?= BASE_URL ?>grupos"
                            class="nav-link <?= $page["current"] === "grupos" ? "active" : "" ?>">
                            <i class="nav-icon fa-solid fa-users"></i>
                            <p>Grupos</p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="<?= BASE_URL ?>alumnos"
                            class="nav-link <?= $page["current"] === "alumnos" ? "active" : "" ?>">
                            <i class="nav-icon fa-solid fa-user-graduate"></i>
                            <p>Alumnos</p>
                        </a>
                    </li> 
                    <!--<li class="nav-item <?= in_array($page["current"], ["diplomados", "modulos", "actividades"]) ? "menu-open" : "" ?>">
                        <a href="#" class="nav-link">
                            <i class="nav-icon fa-solid fa-book"></i>
                            <p>Catálogos<i class="nav-arrow fas fa-angle-left"></i></p>
                        </a>
                        <ul class="nav nav-treeview">
                            <li class="nav-item">
                                <a href="<?= BASE_URL ?>diplomados"
                                    class="nav-link <?= $page["current"] === "diplomados" ? "active" : "" ?>">
                                    <i class="nav-icon fa-solid fa-chalkboard"></i>
                                    <p>Diplomados</p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="#" class="nav-link">
                                    <i class="nav-icon fa-regular fa-folder-open"></i>
                                    <p>Módulos</p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="#" class="nav-link">
                                    <i class="nav-icon fa-regular fa-file"></i>
                                    <p>Actividades</p>
                                </a>
                            </li>
                        </ul>
                    </li>-->
                <?php } ?>

            </ul>
        </nav>
    </div>
</aside>