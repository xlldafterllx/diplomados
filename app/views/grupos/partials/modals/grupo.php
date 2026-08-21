<div class="modal fade" id="modal-grupo" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="title">
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

                        <div class="row">
                            <div class="field field-adjust col-xl-6 col-md-6 mb-3">
                                <div class="row">
                                    <label>Nombre</label>
                                </div>
                                <div class="row">
                                    <div>
                                        <input data-field="nombre" type="text" class="form-control">
                                        <div class="invalid-feedback"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="field field-adjust col-xl-6 col-md-6 mb-3" data-field-container="diplomado">
                                <div class="row">
                                    <label>Diplomado</label>
                                </div>
                                <div class="row">
                                    <div>
                                        <select data-field="diplomado" class="form-control js-select"></select>
                                        <div class="invalid-feedback"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="field field-adjust col-xl-3 col-md-6 mb-3">
                                <div class="row">
                                    <label>Fecha de inicio</label>
                                </div>
                                <div class="row">
                                    <div>
                                        <input data-field="fecha-inicio" type="text" class="form-control">
                                        <div class="invalid-feedback"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="field field-adjust col-xl-3 col-md-6 mb-3">
                                <div class="row">
                                    <label>Hora de inicio</label>
                                </div>
                                <div class="row">
                                    <div>
                                        <input data-field="hora-inicio" type="text" class="form-control">
                                        <div class="invalid-feedback"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="field field-adjust col-xl-6 col-md-6 mb-3">
                                <div class="row">
                                    <label>Tolerancia (en minutos)</label>
                                </div>
                                <div class="row">
                                    <div class="field col-6">
                                        <label>Antes</label>
                                        <input data-field="tolerancia-antes" type="text" class="form-control">
                                        <div class="invalid-feedback"></div>
                                    </div>
                                    <div class="field col-6">
                                        <label>Después</label>
                                        <input data-field="tolerancia-despues" type="text" class="form-control">
                                        <div class="invalid-feedback"></div>
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