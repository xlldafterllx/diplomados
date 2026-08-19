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
            <div class="col-12">

                <div id="grupos" class="card">
                    <div class="card-header">
                        <h3 class="card-title">Grupos</h3>
                        <div class="card-tools">
                            <button type="button" class="btn btn-tool" data-lte-toggle="card-collapse">
                                <i data-lte-icon="expand" class="fa-solid fa-plus"></i>
                                <i data-lte-icon="collapse" class="fa-solid fa-minus"></i>
                            </button>
                        </div>
                    </div>

                    <div class="card-body" data-container="grupos">
                        <table class="table table-striped table-hover" data-table="grupos">
                        </table>
                    </div>

                    <div class="card-footer text-center">
                        <button type="button" class="btn btn-outline-secondary btn-size" data-action="add">Nuevo
                            grupo</button>
                    </div>
                </div>

                <div class="row">
                    <div class="col-12">
                        <div id="grupo-data" class="card p-3 mt-4 hidden" data-tab-actions>
                            <div id="detalles" class="row">

                                <input data-field="id" type="text" class="form-control d-none" disabled>

                                <div class="form-group col-xl-3 col-lg-4 col-md-6 mb-3">
                                    <div class="row">
                                        <label class="field">Nombre</label>
                                    </div>
                                    <div class="row">
                                        <div class="form-group">
                                            <span data-bind="nombre"></span>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group col-xl-3 col-lg-4 col-md-6 mb-3">
                                    <div class="row">
                                        <label class="field">Diplomado</label>
                                    </div>
                                    <div class="row">
                                        <div class="form-group">
                                            <span data-bind="diplomado"></span>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group col-xl-3 col-lg-4 col-md-6 mb-3">
                                    <div class="row">
                                        <label class="field">Fecha de creación</label>
                                    </div>
                                    <div class="row">
                                        <div class="form-group">
                                            <span data-bind="fecha-creacion"></span>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group col-xl-3 col-lg-4 col-md-6 mb-3">
                                    <div class="row">
                                        <label class="field">Alumnos inscritos</label>
                                    </div>
                                    <div class="row">
                                        <div class="form-group">
                                            <span data-bind="alumnos"></span>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group col-xl-3 col-lg-4 col-md-6 mb-3">
                                    <div class="row">
                                        <label class="field">Fecha de inicio</label>
                                    </div>
                                    <div class="row">
                                        <div class="form-group">
                                            <span data-bind="fecha-inicio"></span>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group col-xl-3 col-lg-4 col-md-6 mb-3">
                                    <div class="row">
                                        <label class="field">Hora de inicio</label>
                                    </div>
                                    <div class="row">
                                        <div class="form-group">
                                            <span data-bind="hora-inicio"></span>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group col-xl-3 col-lg-4 col-md-6 mb-3">
                                    <div class="row">
                                        <label class="field">Tolerancia antes</label>
                                    </div>
                                    <div class="row">
                                        <div class="form-group">
                                            <span data-bind="tolerancia-antes"></span>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group col-xl-3 col-lg-4 col-md-6 mb-3">
                                    <div class="row">
                                        <label class="field">Tolerancia después</label>
                                    </div>
                                    <div class="row">
                                        <div class="form-group">
                                            <span data-bind="tolerancia-despues"></span>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group col-xl-3 col-lg-4 col-md-6 mb-3">
                                    <div class="row">
                                        <label class="field">Usuario que lo creo</label>
                                    </div>
                                    <div class="row">
                                        <div class="form-group">
                                            <span data-bind="usuario-creacion"></span>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group col-xl-9 col-lg-12 mb-3">
                                    <div class="row">
                                        <label class="field">URL para asistencia</label>
                                    </div>
                                    <div class="row">
                                        <div class="form-group">
                                            <span data-bind="url"></span>
                                            <a href="#" target="_blank" data-field="url" class="btn btn-outline-primary fa-2xs">
                                                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div class="row mt-4">
                                <nav>
                                    <div class="nav nav-tabs mb-3" id="nav-tab" role="tablist">
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link active" id="alumnos-tab" data-bs-toggle="tab"
                                                data-bs-target="#alumnos" type="button" role="tab" aria-selected="true">
                                                Alumnos
                                            </button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link" id="clases-tab" data-bs-toggle="tab"
                                                data-bs-target="#clases" type="button" role="tab" aria-selected="false"
                                                tabindex="-1">
                                                Clases
                                            </button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link" id="asistencia-tab" data-bs-toggle="tab"
                                                data-bs-target="#asistencia" type="button" role="tab"
                                                aria-selected="false" tabindex="-1">
                                                Asistencia
                                            </button>
                                        </li>
                                    </div>
                                </nav>

                                <div class="tab-content p-2" id="nav-tabContent">

                                    <div class="tab-pane fade active show" id="alumnos" role="tabpanel"
                                        aria-labelledby="alumnos-tab">
                                        <?php require_once VIEWS_PATH . "/grupos/partials/panels/alumnos.php"; ?>
                                    </div>

                                    <div class="tab-pane fade" id="clases" role="tabpanel" aria-labelledby="clases-tab">
                                        <?php require_once VIEWS_PATH . "/grupos/partials/panels/clases.php"; ?>
                                    </div>

                                    <div class="tab-pane fade" id="asistencia" role="tabpanel"
                                        aria-labelledby="asistencia-tab">
                                        <?php require_once VIEWS_PATH . "/grupos/partials/panels/asistencia.php"; ?>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>