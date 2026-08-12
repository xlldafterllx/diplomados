<div class="app-content-header">
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-6">
                <h1 id="title" class="mb-0 fs-3"></h1>
            </div>
            <div class="col-sm-6">
                <nav aria-label="breadcrumb">
                    <ol id="breadcrumb" class="breadcrumb float-sm-end"></ol>
                </nav>
            </div>
        </div>
    </div>
</div>

<div class="app-content">
    <div class="container-fluid">
        <div class="row d-flex justify-content-center">
            <div class="col-12 max-w">

                <div id="welcome" class="row welcome mt-4 hidden">
                    <span class="upper">BIENVENIDO/A<br><?= Session::get("auth.name") ?></span>
                </div>

            </div>
        </div>
    </div>
</div>