<div id="asistencia" class="wrapper">
    <div class="rounded shadow bg-white p-3 text-color box">
        <div class="text-center">
            <img src="<?= BASE_URL ?>assets/img/logo.jpeg" alt="Logo" class="brand-image opacity-75">
        </div>
        <h3 class="mt-2 text-center upper"> Registro de asistencia </h3>
        <p data-bind="diplomado" class="form-label">Diplomado:</p>
        <p data-bind="grupo" class="form-label">Grupo:</p>
        <div autocomplete="off" class="mt-3 pl-2 pr-2">
            <div class="mb-4">
                <label class="form-label">Correo electrónico</label>
                <input data-field="correo" type="text" autocomplete="correo" class="form-control">
            </div>
            <div class="mb-3 text-center">
                <button data-action="check" type="button" class="btn btn-outline-primary">
                    <span class="spinner-load">Registrar asistencia</span>
                    <span class="spinner-loading spinner-border spinner-border-sm hidden"></span>
                    <span class="spinner-loading hidden">Validando...</span>
                </button>
            </div>
        </div>
    </div>
</div>