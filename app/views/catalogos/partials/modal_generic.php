<div class="modal fade" id="modal-generic" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="title">
    <div class="modal-dialog modal-md modal-fullscreen-lg-down">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" data-bind="title"></h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" data-container="value" data-value="">
                <div class="row">
					<div class="col-lg-12">

                        <div class="row">
                            <div class="form-group col-xl-12">
                                <div class="row">
                                    <label data-bind="name"></label>
                                </div>
                                <div class="row">
                                    <div class="form-group col box ui-front">
                                        <input data-field="nombre" type="text" class="form-control">
                                    </div>
                                </div>
                            </div>
                            <input data-field="diplomado" type="text" class="form-control hidden" disabled>
                            <input data-field="modulo" type="text" class="form-control hidden" disabled>
                            <input data-field="actividad" type="text" class="form-control hidden" disabled>
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