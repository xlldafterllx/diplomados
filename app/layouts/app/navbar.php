<!-- Navbar -->
<nav class="app-header navbar navbar-expand bg-body">
  <div class="container-fluid">
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" data-lte-toggle="sidebar" href="#" role="button" aria-label="Toggle sidebar">
          <i class="fas fa-bars"></i>
        </a>
      </li>
      <!--<li class="d-flex align-items-center ml-2">
        <h4 class="mb-0"><?= Config::get("app.name") ?></h4>
      </li>-->
    </ul>

    <ul class="navbar-nav ms-auto">
      <li class="nav-item dropdown">
        <a class="nav-link" href="#" id="bd-theme" aria-label="Toggle color scheme" data-bs-toggle="dropdown"
          aria-expanded="false">
          <i class="fa-solid fa-sun d-none" data-lte-theme-icon="light"></i>
          <i class="fa-solid fa-moon" data-lte-theme-icon="dark"></i>
          <i class="fa-solid fa-circle-half-stroke d-none" data-lte-theme-icon="auto"></i>
        </a>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="bd-theme">
          <li>
            <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="light" aria-pressed="false">
              <i class="fa-solid fa-sun me-2"></i>
              Claro
              <i class="fa-solid fa-check ms-auto d-none"></i>
            </button>
          </li>
          <li>
            <button type="button" class="dropdown-item d-flex align-items-center active" data-bs-theme-value="dark" aria-pressed="true">
              <i class="fa-solid fa-moon me-2"></i>
              Obscuro
              <i class="fa-solid fa-check ms-auto"></i>
            </button>
          </li>
          <li>
            <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="auto" aria-pressed="false">
              <i class="fa-solid fa-circle-half-stroke me-2"></i>
              Auto
              <i class="fa-solid fa-check ms-auto d-none"></i>
            </button>
          </li>
        </ul>
      </li>

      <li class="nav-item dropdown user-menu">
        <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="<?= BASE_URL ?>assets/img/profile_250x250.png" class="user-image rounded-circle shadow"
            alt="User Image">
          <span class="d-none d-md-inline"><?= Session::get("auth.name") ?></span>
        </a>
        <ul class="dropdown-menu dropdown-menu-lg dropdown-menu-end">
          <li class="user-header bg-gradient">
            <img src="<?= BASE_URL ?>assets/img/profile_250x250.png" class="rounded-circle shadow" alt="User Image">
            <p>
              <span class="d-none d-md-inline"><?= Session::get("auth.name") ?></span>
              <small><?= Session::get("auth.role_des") ?></small>
            </p>
          </li>

          <!--<li class="user-body">
            <div class="row" bis_skin_checked="1">
              <div class="col-4 text-center" bis_skin_checked="1">
                <a href="#">Followers</a>
              </div>
              <div class="col-4 text-center" bis_skin_checked="1">
                <a href="#">Sales</a>
              </div>
              <div class="col-4 text-center" bis_skin_checked="1">
                <a href="#">Friends</a>
              </div>
            </div>
          </li>-->

          <li class="user-footer">
            <!-- <a href="#" class="btn btn-default btn-flat">Perfil</a> -->
            <button data-action="login" type="button" class="btn btn-outline-secondary float-end" onclick="logout();"> Cerrar sesión</button>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</nav>
<!-- /.navbar -->