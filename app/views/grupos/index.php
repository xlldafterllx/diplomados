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
                        <div data-field-container="grupos">
                            <table class="table table-striped table-hover" data-table="grupos">
                            </table>
                        </div>
                    </div>

                    <div class="card-footer text-center">
                        <button type="button" class="btn btn-outline-secondary" data-action="new">Nuevo grupo</button>
                    </div>
                </div>

                <div id="grupo-data" class="card mt-4" data-tab-actions>
                    <div class="card-header p-0 border-bottom-0">
                        <ul class="nav nav-tabs" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="detalles-tab" data-bs-toggle="tab"
                                    data-bs-target="#detalles" type="button" role="tab" aria-selected="true">
                                    Detalles
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="alumnos-tab" data-bs-toggle="tab" data-bs-target="#alumnos"
                                    type="button" role="tab" aria-selected="false" tabindex="-1">
                                    Alumnos
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="clases-tab" data-bs-toggle="tab" data-bs-target="#clases"
                                    type="button" role="tab" aria-selected="false" tabindex="-1">
                                    Clases
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div class="card-body">
                        <div class="tab-content">

                            <div class="tab-pane fade active show" id="detalles" role="tabpanel"
                                aria-labelledby="detalles-tab">
                                DETALLES
                            </div>

                            <div class="tab-pane fade" id="alumnos" role="tabpanel" aria-labelledby="alumnos-tab">
                                <table class="table table-striped table-hover" data-table="alumnos">
                                </table>
                            </div>

                            <div class="tab-pane fade" id="clases" role="tabpanel" aria-labelledby="clases-tab">
                                <table class="table table-striped table-hover" data-table="clases">
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="card-footer d-flex justify-content-center justify-content-evenly">
                        <button type="button" class="btn btn-outline-secondary" data-action="detalles-edit"
                            data-tab-action="detalles">Editar
                            datos</button>

                        <button type="button" class="btn btn-outline-secondary" data-action="alumnos-add"
                            data-tab-action="alumnos">Agregar
                            alumno</button>
                        <button type="button" class="btn btn-outline-secondary" data-action="alumnos-import"
                            data-tab-action="alumnos">Importar
                            alumnos</button>
                        <button type="button" class="btn btn-outline-secondary" data-action="alumnos-template"
                            data-tab-action="alumnos">Descargar
                            plantilla</button>

                        <button type="button" class="btn btn-outline-secondary" data-action="clases-add"
                            data-tab-action="clases">Agregar
                            clase</button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>