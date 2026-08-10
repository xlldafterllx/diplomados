<div class="modal fade" id="modal-alumno" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="title">
    <div class="modal-dialog modal-lg modal-fullscreen-md-down">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" data-bind="title"></h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
					<div class="col-lg-12">
                        <input data-field="id" type="text" class="form-control d-none" disabled>

                        <div class="row" data-container="buscar">
                            <div class="form-group col-xl-8 col-md-12 mb-3">
                                <div class="row">
                                    <label>Buscar alumno</label>
                                </div>
                                <div class="row">
                                    <div class="form-group">
                                        <input data-field="buscar" type="text" class="form-control">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="form-group col-xl-4 col-md-6 mb-3">
                                <div class="row">
                                    <label>Nombre</label>
                                </div>
                                <div class="row">
                                    <div class="form-group">
                                        <input data-field="nombre" type="text" class="form-control">
                                    </div>
                                </div>
                            </div>

                            <div class="form-group col-xl-4 col-md-6 mb-3">
                                <div class="row">
                                    <label>Primer apellido</label>
                                </div>
                                <div class="row">
                                    <div class="form-group">
                                        <input data-field="apellido-1" type="text" class="form-control">
                                    </div>
                                </div>
                            </div>

                            <div class="form-group col-xl-4 col-md-6 mb-3">
                                <div class="row">
                                    <label>Segundo apellido</label>
                                </div>
                                <div class="row">
                                    <div class="form-group">
                                        <input data-field="apellido-2" type="text" class="form-control">
                                    </div>
                                </div>
                            </div>

                            <div class="form-group col-xl-6 col-md-6 mb-3">
                                <div class="row">
                                    <label>Correo electrónico</label>
                                </div>
                                <div class="row">
                                    <div class="form-group">
                                        <input data-field="correo" type="text" class="form-control">
                                    </div>
                                </div>
                            </div>

                            <div class="form-group col-xl-6 col-md-6 mb-3">
                                <div class="row">
                                    <label>Institución</label>
                                </div>
                                <div class="row">
                                    <div class="form-group">
                                        <input data-field="institucion" type="text" class="form-control">
                                    </div>
                                </div>
                            </div>

                        </div>

					</div>
				</div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary btn-size" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-outline-success btn-size" data-container="button" data-action="">
                    <span class="spinner-load">Guardar</span>
                    <span class="spinner-loading spinner-border spinner-border-sm" style="display: none;"></span>
                    <span class="spinner-loading" style="display: none;">Guardando...</span> 
                </button>
            </div>
        </div>
    </div>
</div>