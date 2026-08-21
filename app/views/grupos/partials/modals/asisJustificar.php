<div class="modal fade" id="modal-justificar" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="title">
    <div class="modal-dialog modal-lg modal-fullscreen-md-down">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" data-bind="title">Justificar falta</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
					<div class="col-lg-12">
                        <input data-field="id" type="text" class="form-control d-none" disabled>

                        <div class="row">
                            <div class="field field-adjust col-xl-6 col-md-6" data-field-container="alumnos">
                                <div class="row">
                                    <label>Alumno</label>
                                </div>
                                <div class="row">
                                    <div>
                                        <select data-field="alumno" class="form-control js-select"></select>
                                        <div class="invalid-feedback"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="field field-adjust col-xl-6 col-md-6" data-field-container="clases">
                                <div class="row">
                                    <label>Clase</label>
                                </div>
                                <div class="row">
                                    <div>
                                        <select data-field="clase" class="form-control js-select"></select>
                                        <div class="invalid-feedback"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="field field-adjust col-xl-12">
                                <div class="row">
                                    <label>Motivo</label>
                                </div>
                                <div class="row">
                                    <div>
                                        <input data-field="motivo" type="text" class="form-control">
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
                <button type="button" class="btn btn-outline-success btn-size" data-container="button" data-action="save">
                    <span class="spinner-load">Guardar</span>
                    <span class="spinner-loading spinner-border spinner-border-sm" style="display: none;"></span>
                    <span class="spinner-loading" style="display: none;">Guardando...</span> 
                </button>
            </div>
        </div>
    </div>
</div>