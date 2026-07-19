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
        <div class="row">
            <div class="col-12">

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Diplomados</h3>
                        <div class="card-tools">
                            <button type="button" class="btn btn-tool" data-lte-toggle="card-collapse">
                                <i data-lte-icon="expand" class="fa-solid fa-plus"></i>
                                <i data-lte-icon="collapse" class="fa-solid fa-minus"></i>
                            </button>
                        </div>
                    </div>

                    <div class="card-body">Tabla de diplomados</div>

                    <div class="card-footer text-center">
                        <button type="button" class="btn btn-outline-secondary" data-action="add">Nuevo
                            diplomado</button>
                    </div>
                </div>

                <div class="card mt-4 collapsed-card">
                    <div class="card-header">
                        <h3 class="card-title">Módulos</h3>
                        <div class="card-tools">
                            <button type="button" class="btn btn-tool" data-lte-toggle="card-collapse">
                                <i data-lte-icon="expand" class="fa-solid fa-plus"></i>
                                <i data-lte-icon="collapse" class="fa-solid fa-minus"></i>
                            </button>
                        </div>
                    </div>

                    <div class="card-body">
                        <div data-field-container="diplomados">
                            <table class="table table-striped table-hover" data-table="diplomados">
                            </table>
                        </div>
                    </div>

                    <div class="card-footer text-center">
                        <button type="button" class="btn btn-outline-secondary" data-action="add">Nuevo
                            diplomado</button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>