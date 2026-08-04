<div class="modal fade" id="modal-grupo" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="title">
    <div class="modal-dialog modal-lg modal-fullscreen-lg-down">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" data-bind="title"></h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
					<div class="col-lg-12">
                        <input data-field="grupo-id" type="text" class="form-control d-none" disabled>

                        <div class="row">
                            <div class="form-group col-xl-4 mb-3 col-md-6">
                                <div class="row">
                                    <label>Nombre</label>
                                </div>
                                <div class="row">
                                    <div class="form-group">
                                        <input data-field="nombre" type="text" class="form-control">
                                    </div>
                                </div>
                            </div>

                            <div class="form-group col-xl-4 mb-3 col-md-6" data-field-container="diplomado">
                                <div class="row">
                                    <label>Diplomado</label>
                                </div>
                                <div class="row">
                                    <div class="form-group">
                                        <select data-field="diplomado" class="form-control js-select"></select>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group col-xl-4 mb-3 col-md-6">
                                <div class="row">
                                    <label>Fecha de inicio</label>
                                </div>
                                <div class="row">
                                    <div class="form-group">
                                        <input data-field="fecha-inicio" type="text" class="form-control">
                                    </div>
                                </div>
                            </div>

                            <div class="form-group col-xl-4 mb-3 col-md-6">
                                <div class="row">
                                    <label>Hora de inicio</label>
                                </div>
                                <div class="row">
                                    <div class="form-group">
                                        <input data-field="hora-inicio" type="text" class="form-control">
                                    </div>
                                </div>
                            </div>

                            <div class="form-group col-xl-4 mb-3 col-md-6">
                                <div class="row">
                                    <label>Cantidad de clases</label>
                                </div>
                                <div class="row">
                                    <div class="form-group">
                                        <input data-field="clases" type="text" class="form-control">
                                    </div>
                                </div>
                            </div>

                            <div class="form-group col-xl-4 mb-3 col-md-6" data-field-container="dia">
                                <div class="row">
                                    <label>Día de la clase</label>
                                </div>
                                <div class="row">
                                    <div class="form-group">
                                        <select data-field="dia" class="form-control js-select" disabled></select>
                                    </div>
                                </div>
                            </div>
                        </div>

					</div>
				</div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-outline-success" data-container="button" data-action="">
                    <span class="spinner-load">Guardar</span>
                    <span class="spinner-loading spinner-border spinner-border-sm" style="display: none;"></span>
                    <span class="spinner-loading" style="display: none;">Guardando...</span> 
                </button>
            </div>
        </div>
    </div>
</div>