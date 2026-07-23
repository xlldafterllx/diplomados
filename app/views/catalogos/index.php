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

                <div id="diplomados" class="card">
                    <div class="card-header">
                        <h3 class="card-title">Diplomados</h3>
                        <div class="card-tools">
                            <button type="button" class="btn btn-tool" data-lte-toggle="card-collapse">
                                <i data-lte-icon="expand" class="fa-solid fa-plus"></i>
                                <i data-lte-icon="collapse" class="fa-solid fa-minus"></i>
                            </button>
                        </div>
                    </div>

                    <div class="card-body" data-container="diplomados">
                        <div data-field-container="diplomados">
                            <table class="table table-striped table-hover" data-table="diplomados">
                            </table>
                        </div>
                    </div>

                    <div class="card-footer text-center">
                        <button type="button" class="btn btn-outline-secondary" data-action="new">Nuevo
                            diplomado</button>
                    </div>
                </div>

                <div id="modulos" class="card mt-4" style="display: none;">
                    <div class="card-header">
                        <h3 class="card-title" data-bind="title">Modulos</h3>
                        <div class="card-tools">
                            <button type="button" class="btn btn-tool" data-lte-toggle="card-collapse">
                                <i data-lte-icon="expand" class="fa-solid fa-plus"></i>
                                <i data-lte-icon="collapse" class="fa-solid fa-minus"></i>
                            </button>
                        </div>
                    </div>

                    <div class="card-body">
                        <div data-field-container="modulos">
                            <table class="table table-striped table-hover" data-table="modulos">
                            </table>
                        </div>
                    </div>

                    <div class="card-footer text-center">
                        <button type="button" class="btn btn-outline-secondary" data-action="new">Nuevo módulo</button>
                    </div>
                </div>

                <div id="actividades" class="card mt-4" style="display: none;">
                    <div class="card-header">
                        <h3 class="card-title" data-bind="title">Actividades</h3>
                        <div class="card-tools">
                            <button type="button" class="btn btn-tool" data-lte-toggle="card-collapse">
                                <i data-lte-icon="expand" class="fa-solid fa-plus"></i>
                                <i data-lte-icon="collapse" class="fa-solid fa-minus"></i>
                            </button>
                        </div>
                    </div>

                    <div class="card-body">
                        <div data-field-container="actividades">
                            <table class="table table-striped table-hover" data-table="actividades">
                            </table>
                        </div>
                    </div>

                    <div class="card-footer text-center">
                        <button type="button" class="btn btn-outline-secondary" data-action="new">Nueva
                            actividad</button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>