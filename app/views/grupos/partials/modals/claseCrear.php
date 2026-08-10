<div class="modal fade" id="modal-clase-crear" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="title">
    <div class="modal-dialog modal-lg modal-fullscreen-md-down">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" data-bind="title">Agregar clase(s)</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
					<div class="col-lg-12">
                        <input data-field="id" type="text" class="form-control d-none" disabled>

                        <div class="row">
                            <div class="form-group col-xl-6 col-md-6 mb-3">
                                <div class="row">
                                    <label>A partir del</label>
                                </div>
                                <div class="row">
                                    <div class="form-group">
                                        <input data-field="fecha-inicio" type="text" class="form-control">
                                    </div>
                                </div>
                            </div>

                            <div class="form-group col-xl-6 col-md-6 mb-3">
                                <div class="row">
                                    <label>A las</label>
                                </div>
                                <div class="row">
                                    <div class="form-group">
                                        <input data-field="hora-inicio" type="text" class="form-control">
                                    </div>
                                </div>
                            </div>

                            <div class="form-group col-xl-4 col-md-6 mb-3">
                                <div class="row">
                                    <label>Cantidad de clases</label>
                                </div>
                                <div class="row">
                                    <div class="form-group">
                                        <input data-field="cantidad" type="text" class="form-control">
                                    </div>
                                </div>
                            </div>

                            <div class="form-group col-xl-8 col-md-6 mb-3" data-field-container="tiempo">
                                <div class="row">
                                    <label>Cada cuando</label>
                                </div>
                                <div class="row">
                                    <div class="form-group col-6">
                                        <input data-field="cada" type="text" class="form-control">                                        
                                    </div>
                                    <div class="form-group col-6">
                                        <select data-field="tiempo" class="form-control js-select"></select>
                                    </div>                                    
                                </div>
                            </div>
                        </div>

					</div>
				</div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary btn-size" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-outline-success btn-size" data-container="button" data-action="add">
                    <span class="spinner-load">Agregar</span>
                    <span class="spinner-loading spinner-border spinner-border-sm" style="display: none;"></span>
                    <span class="spinner-loading" style="display: none;">Agregando...</span> 
                </button>
            </div>
        </div>
    </div>
</div>