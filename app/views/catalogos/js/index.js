const API_DIPLOMADOS_LIST = API_URL + "diplomados/list.php";
const API_DIPLOMADOS_STORE = API_URL + "diplomados/store.php";
const API_DIPLOMADOS_EDIT = API_URL + "diplomados/edit-form.php";
const API_DIPLOMADOS_UPDATE = API_URL + "diplomados/update.php";
const API_DIPLOMADOS_DELETE = API_URL + "diplomados/delete.php";

const API_MODULOS_LIST = API_URL + "modulos/list.php";
const API_MODULOS_STORE = API_URL + "modulos/store.php";
const API_MODULOS_EDIT = API_URL + "modulos/edit-form.php";
const API_MODULOS_UPDATE = API_URL + "modulos/update.php";
const API_MODULOS_DELETE = API_URL + "modulos/delete.php";

const API_ACTIVIDADES_LIST = API_URL + "actividades/list.php";
const API_ACTIVIDADES_STORE = API_URL + "actividades/store.php";
const API_ACTIVIDADES_EDIT = API_URL + "actividades/edit-form.php";
const API_ACTIVIDADES_UPDATE = API_URL + "actividades/update.php";
const API_ACTIVIDADES_DELETE = API_URL + "actividades/delete.php";

// Components
let diplomados;
let modulos;
let actividades;
let modal;

// Tables
let tableDiplomados;
let tableModulos;
let tableActividades;

// Rules
const rules = {
    "nombre": {
        name: "Nombre",
        rules: "required|string"
    }
};

$(function () {
    initialize();
    loadDiplomados();
});

function initialize() {
    window.HttpClient = HttpClient;
    window.HttpException = HttpException;

    initializeComponents();
    initializeTables();
    initializeEvents();
}

function initializeComponents() {
    diplomados = new ComponentHelper("#diplomados");
    modulos = new ComponentHelper("#modulos");
    actividades = new ComponentHelper("#actividades");
    modal = new ComponentHelper("#modal-generic");

    initializeComponentActions();
}

function initializeComponentActions() {
    diplomados.onAction("new", () => {
        modal.clear();
        modal.setBinds({ "title": "Crear diplomado", "name": "Nombre del diplomado" });
        modal.getContainer("button").attr("data-action", "save");
        modal.getContainer("value").attr("data-value", "diplomado");
        modal.open();
    });

    modulos.onAction("new", () => {
        modal.clear();
        modal.setData({ "diplomado": modulos.getField("diplomado").val() });
        modal.setBinds({ "title": "Crear módulo", "name": "Nombre del módulo" });
        modal.getContainer("button").attr("data-action", "save");
        modal.getContainer("value").attr("data-value", "modulo");
        modal.open();
    });

    actividades.onAction("new", () => {
        modal.clear();
        modal.setData({ "diplomado": actividades.getField("diplomado").val(), "modulo": actividades.getField("modulo").val() });
        modal.setBinds({ "title": "Crear actividad", "name": "Nombre de la actividad" });
        modal.getContainer("button").attr("data-action", "save");
        modal.getContainer("value").attr("data-value", "actividad");
        modal.open();
    });

    modal.onAction("save", async () => {
        switch (modal.getContainer("value").attr("data-value")) {
            case "diplomado":
                newDiplomado();
                break;
            case "modulo":
                newModulo();
                break;
            case "actividad":
                newActividad();
                break;
        }
    });

    modal.onAction("update", async () => {
        switch (modal.getContainer("value").attr("data-value")) {
            case "diplomado":
                updateDiplomado();
                break;
            case "modulo":
                updateModulo();
                break;
            case "actividad":
                updateActividad();
                break;
        }
    });
}

function initializeEvents() {
    diplomados
        .getTable("diplomados")
        .off("click.diplomados")
        .on("click.diplomados", "[data-action]", function () {
            const action = $(this).data("action");
            const diplomado = $(this).data("id");
            const nombre = decodeURIComponent($(this).data("nombre"));

            if (action === "load") {
                loadModulos(diplomado, nombre);
            }

            if (action === "edit") {
                editDiplomado(diplomado);
            }

            if (action === "delete") {
                deleteDiplomado(diplomado, nombre);
            }
        });

    modulos
        .getTable("modulos")
        .off("click.modulos")
        .on("click.modulos", "[data-action]", function () {
            const action = $(this).data("action");
            const diplomado = $(this).data("diplomado");
            const modulo = $(this).data("id");
            const nombre = decodeURIComponent($(this).data("nombre"));

            if (action === "load") {
                loadActividades(diplomado, modulo, nombre);
            }

            if (action === "edit") {
                editModulo(diplomado, modulo);
            }

            if (action === "delete") {
                deleteModulo(diplomado, modulo, nombre);
            }
        });

    actividades
        .getTable("actividades")
        .off("click.actividades")
        .on("click.actividades", "[data-action]", function () {
            const action = $(this).data("action");
            const diplomado = $(this).data("diplomado");
            const modulo = $(this).data("modulo");
            const actividad = $(this).data("id");
            const nombre = decodeURIComponent($(this).data("nombre"));

            if (action === "edit") {
                editActividad(diplomado, modulo, actividad);
            }

            if (action === "delete") {
                deleteActividad(diplomado, modulo, actividad, nombre);
            }
        });
}

function initializeTables() {
    initializeTableDiplomados();
    initializeTableModulos();
    initializeTableActividades();
}

function initializeTableDiplomados() {
    const columns = [
        {
            data: 'nombre',
            name: 'nombre',
            title: 'Nombre del diplomado'
        },
        {
            data: 'fecha_creacion',
            name: 'fecha_creacion',
            title: 'Fecha de creación',
            type: "datetime",
            render: DataTable.render.datetime('DD/MM/YYYY h:mm a')
        },
        {
            data: 'usuario_creacion',
            name: 'usuario_creacion',
            title: 'Usuario que lo creo'
        },
        {
            data: 'id',
            name: 'actions',
            title: '',
            render: function (data, type, row, meta) {
                if (type === 'display') {
                    data = `
                        <div class="d-flex justify-content-around align-items-stretch">
                            <button type="button" title="Ver módulos" class="btn btn-outline-primary" data-action="load" data-id="${data}" data-nombre="${encodeURIComponent(row.nombre)}">
                                <i class="fa-solid fa-file-arrow-down"></i>
                            </button>
                            &nbsp;
                            <button type="button" title="Editar diplomado" class="btn btn-outline-success" data-action="edit" data-id="${data}">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            &nbsp;
                            <button type="button" title="Eliminar diplomado" class="btn btn-outline-danger" data-action="delete" data-id="${data}" data-nombre="${encodeURIComponent(row.nombre)}">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                        `;
                }
                return data;
            }
        }
    ]

    tableDiplomados = TableHelper.create(
        diplomados,
        "diplomados",
        {
            columns,
            fixedColumns: { left: 0, right: 1 },
            order: [{ name: "nombre", dir: "asc" }],
            ordering: {
                indicators: false,
                handler: false
            },
            columnControl: [
                "order",
                "searchDropdown"
            ],
            columnDefs: [
                { targets: "actions:name", width: 1, orderable: false, className: "notexport", columnControl: [] },
                { targets: "_all", className: "align-content-center dt-head-nowrap dt-head-left dt-body-left" },
                {
                    targets: "fecha_creacion:name", className: "dt-body-nowrap", columnControl: ["order", {
                        extend: "searchDropdown",
                        mask: "YYYY-MM-DD",
                        format: "DD/MM/YYYY"
                    }]
                }
            ],
            ...TableHelper.exportButtons({
                title: "Diplomados",
                filename: "diplomados_" + moment(TODAY).format(formatDateExport),
                buttons: ["ccSearchClear"]
            }),
            exportOptions: {
                columns: ":not(.notexport)"
            }
        }
    );
}

function initializeTableModulos() {
    const columns = [
        {
            data: 'orden',
            name: 'orden',
            title: '#'
        },
        {
            data: 'nombre',
            name: 'nombre',
            title: 'Nombre del módulo'
        },
        {
            data: 'fecha_creacion',
            name: 'fecha_creacion',
            title: 'Fecha de creación',
            type: "datetime",
            render: DataTable.render.datetime('DD/MM/YYYY h:mm a')
        },
        {
            data: 'usuario_creacion',
            name: 'usuario_creacion',
            title: 'Usuario que lo creo'
        },
        {
            data: 'id',
            name: 'actions',
            title: '',
            render: function (data, type, row, meta) {
                if (type === 'display') {
                    data = `
                        <div class="d-flex justify-content-around align-items-stretch">
                            <button type="button" title="Ver actividades" class="btn btn-outline-primary" data-action="load" data-id="${data}" data-diplomado="${row.diplomado_id}" data-nombre="${encodeURIComponent(row.nombre)}">
                                <i class="fa-solid fa-file-arrow-down"></i>
                            </button>
                            &nbsp;
                            <button type="button" title="Editar módulo" class="btn btn-outline-success" data-action="edit" data-id="${data}" data-diplomado="${row.diplomado_id}">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            &nbsp;
                            <button type="button" title="Eliminar módulo" class="btn btn-outline-danger" data-action="delete" data-id="${data}" data-diplomado="${row.diplomado_id}" data-nombre="${encodeURIComponent(row.nombre)}">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                        `;
                }
                return data;
            }
        }
    ]

    tableModulos = TableHelper.create(
        modulos,
        "modulos",
        {
            columns,
            fixedColumns: { left: 0, right: 1 },
            order: [{ name: "orden", dir: "asc" }],
            ordering: {
                indicators: false,
                handler: false
            },
            columnControl: [
                "order",
                "searchDropdown"
            ],
            columnDefs: [
                { targets: "actions:name", width: 1, orderable: false, className: "notexport", columnControl: [] },
                { targets: "_all", className: "align-content-center dt-head-nowrap dt-head-left dt-body-left" },
                {
                    targets: "fecha_creacion:name", className: "dt-body-nowrap", columnControl: ["order", {
                        extend: "searchDropdown",
                        mask: "YYYY-MM-DD",
                        format: "DD/MM/YYYY"
                    }]
                }
            ],
            ...TableHelper.exportButtons({
                title: "Modulos",
                filename: "modulos_" + moment(TODAY).format(formatDateExport),
                buttons: ["ccSearchClear"]
            }),
            exportOptions: {
                columns: ":not(.notexport)"
            }
        }
    );
}

function initializeTableActividades() {
    const columns = [
        {
            data: 'orden',
            name: 'orden',
            title: '#'
        },
        {
            data: 'nombre',
            name: 'nombre',
            title: 'Nombre de la actividad'
        },
        {
            data: 'fecha_creacion',
            name: 'fecha_creacion',
            title: 'Fecha de creación',
            type: "datetime",
            render: DataTable.render.datetime('DD/MM/YYYY h:mm a')
        },
        {
            data: 'usuario_creacion',
            name: 'usuario_creacion',
            title: 'Usuario que lo creo'
        },
        {
            data: 'id',
            name: 'actions',
            title: '',
            render: function (data, type, row, meta) {
                if (type === 'display') {
                    data = `
                        <div class="d-flex justify-content-around align-items-stretch">
                            <button type="button" title="Editar actividad" class="btn btn-outline-success" data-action="edit" data-id="${data}" data-diplomado="${row.diplomado_id}" data-modulo="${row.modulo_id}">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            &nbsp;
                            <button type="button" title="Eliminar actividad" class="btn btn-outline-danger" data-action="delete" data-id="${data}" data-diplomado="${row.diplomado_id}" data-modulo="${row.modulo_id}" data-nombre="${encodeURIComponent(row.nombre)}">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                        `;
                }
                return data;
            }
        }
    ]

    tableActividades = TableHelper.create(
        actividades,
        "actividades",
        {
            columns,
            fixedColumns: { left: 0, right: 1 },
            order: [{ name: "orden", dir: "asc" }],
            ordering: {
                indicators: false,
                handler: false
            },
            columnControl: [
                "order",
                "searchDropdown"
            ],
            columnDefs: [
                { targets: "actions:name", width: 1, orderable: false, className: "notexport", columnControl: [] },
                { targets: "_all", className: "align-content-center dt-head-nowrap dt-head-left dt-body-left" },
                {
                    targets: "fecha_creacion:name", className: "dt-body-nowrap", columnControl: ["order", {
                        extend: "searchDropdown",
                        mask: "YYYY-MM-DD",
                        format: "DD/MM/YYYY"
                    }]
                }
            ],
            ...TableHelper.exportButtons({
                title: "Actividades",
                filename: "actividades_" + moment(TODAY).format(formatDateExport),
                buttons: ["ccSearchClear"]
            }),
            exportOptions: {
                columns: ":not(.notexport)"
            }
        }
    );
}

async function loadDiplomados() {
    try {
        Loader.show();
        modulos.slideUp();
        actividades.slideUp();

        const { data: data } = await HttpClient.get(API_DIPLOMADOS_LIST);

        TableHelper.update(tableDiplomados, data);
    } catch (error) {
        console.log(error.response ?? error);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: error.message
        });
    } finally {
        Loader.hide();
    }
}

async function loadModulos(diplomado, nombre) {
    try {
        Loader.show();
        actividades.slideUp();

        modulos.setData({ diplomado: diplomado });
        modulos.setBinds({ title: `Módulos de "${nombre}"` });

        const { data: data } = await HttpClient.post(API_MODULOS_LIST, { "diplomado": diplomado });

        TableHelper.update(tableModulos, data);

        modulos.slideDown();
        scrollToElement(modulos);
    } catch (error) {
        console.log(error.response ?? error);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: error.message
        });
    } finally {
        Loader.hide();
    }
}

async function loadActividades(diplomado, modulo, nombre) {
    try {
        Loader.show();

        actividades.setData({ diplomado: diplomado, modulo: modulo });
        actividades.setBinds({ title: `Actividades de "${nombre}"` });

        const { data: data } = await HttpClient.post(API_ACTIVIDADES_LIST, { "diplomado": diplomado, "modulo": modulo });

        TableHelper.update(tableActividades, data);

        actividades.slideDown();
        scrollToElement(actividades);
    } catch (error) {
        console.log(error.response ?? error);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: error.message
        });
    } finally {
        Loader.hide();
    }
}

async function newDiplomado() {
    if (!validateFields(modal, rules)) return;

    try {
        Loader.show();

        const { message: message } = await HttpClient.post(API_DIPLOMADOS_STORE, modal.getData());
        const { data: data } = await HttpClient.get(API_DIPLOMADOS_LIST);

        TableHelper.update(tableDiplomados, data);
        modal.close();

        Toast.fire({
            icon: "success",
            title: message
        });
    } catch (error) {
        console.log(error.response ?? error);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: error.message
        });
    } finally {
        Loader.hide();
    }
}

async function newModulo() {
    if (!validateFields(modal, rules)) return;
    modal.buttonOff("save");

    try {
        const { message: message } = await HttpClient.post(API_MODULOS_STORE, modal.getData());
        const { data: data } = await HttpClient.post(API_MODULOS_LIST, { "diplomado": modal.getField("diplomado").val() });

        TableHelper.update(tableModulos, data);
        modal.close();

        Toast.fire({
            icon: "success",
            title: message
        });
    } catch (error) {
        console.log(error.response ?? error);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: error.message
        });
    } finally {
        modal.buttonOn("save");
    }
}

async function newActividad() {
    if (!validateFields(modal, rules)) return;
    modal.buttonOff("save");

    try {
        const { message: message } = await HttpClient.post(API_ACTIVIDADES_STORE, modal.getData());
        const { data: data } = await HttpClient.post(API_ACTIVIDADES_LIST, { "diplomado": modal.getField("diplomado").val(), "modulo": modal.getField("modulo").val() });

        TableHelper.update(tableActividades, data);
        modal.close();

        Toast.fire({
            icon: "success",
            title: message
        });
    } catch (error) {
        console.log(error.response ?? error);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: error.message
        });
    } finally {
        modal.buttonOn("save");
    }
}

async function editDiplomado(diplomado) {
    try {
        Loader.show();

        const { data: data } = await HttpClient.post(API_DIPLOMADOS_EDIT, { "diplomado": diplomado });

        modal.setData({ "nombre": data, "diplomado": diplomado });
        modal.setBinds({ "title": "Editar diplomado", "name": "Nombre del diplomado" });

        modal.getContainer("button").attr("data-action", "update");
        modal.getContainer("value").attr("data-value", "diplomado");

        modal.open();
    } catch (error) {
        console.log(error.response ?? error);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: error.message
        });
    } finally {
        Loader.hide();
    }
}

async function editModulo(diplomado, modulo) {
    try {
        Loader.show();

        const { data: data } = await HttpClient.post(API_MODULOS_EDIT, { "diplomado": diplomado, "modulo": modulo });

        modal.setData({ "nombre": data, "diplomado": diplomado, "modulo": modulo });
        modal.setBinds({ "title": "Editar módulo", "name": "Nombre del módulo" });

        modal.getContainer("button").attr("data-action", "update");
        modal.getContainer("value").attr("data-value", "modulo");

        modal.open();
    } catch (error) {
        console.log(error.response ?? error);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: error.message
        });
    } finally {
        Loader.hide();
    }
}

async function editActividad(diplomado, modulo, actividad) {
    try {
        Loader.show();

        const { data: data } = await HttpClient.post(API_ACTIVIDADES_EDIT, { "diplomado": diplomado, "modulo": modulo, "actividad": actividad });

        modal.setData({ "nombre": data, "diplomado": diplomado, "modulo": modulo, "actividad": actividad });
        modal.setBinds({ "title": "Editar actividad", "name": "Nombre de la actividad" });

        modal.getContainer("button").attr("data-action", "update");
        modal.getContainer("value").attr("data-value", "actividad");

        modal.open();
    } catch (error) {
        console.log(error.response ?? error);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: error.message
        });
    } finally {
        Loader.hide();
    }
}

async function updateDiplomado() {
    if (!validateFields(modal, rules)) return;

    try {
        Loader.show();

        const { message: message } = await HttpClient.post(API_DIPLOMADOS_UPDATE, modal.getData());
        const { data: data } = await HttpClient.get(API_DIPLOMADOS_LIST);

        TableHelper.update(tableDiplomados, data);

        if (modal.getField("diplomado").val() == modulos.getField("diplomado").val())
            modulos.setBinds({ title: `Módulos de "${modal.getField("nombre").val()}"` });

        modal.close();

        Toast.fire({
            icon: "success",
            title: message
        });
    } catch (error) {
        console.log(error.response ?? error);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: error.message
        });
    } finally {
        Loader.hide();
    }
}

async function updateModulo() {
    if (!validateFields(modal, rules)) return;
    modal.buttonOff("save");

    try {
        const { message: message } = await HttpClient.post(API_MODULOS_UPDATE, modal.getData());
        const { data: data } = await HttpClient.post(API_MODULOS_LIST, { "diplomado": modal.getField("diplomado").val() });

        TableHelper.update(tableModulos, data);

        if (modal.getField("diplomado").val() == actividades.getField("diplomado").val() &&
            modal.getField("modulo").val() == actividades.getField("modulo").val())
            actividades.setBinds({ title: `Actividades de "${modal.getField("nombre").val()}"` });

        modal.close();

        Toast.fire({
            icon: "success",
            title: message
        });
    } catch (error) {
        console.log(error.response ?? error);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: error.message
        });
    } finally {
        modal.buttonOn("save");
    }
}

async function updateActividad() {
    if (!validateFields(modal, rules)) return;
    modal.buttonOff("save");

    try {
        const { message: message } = await HttpClient.post(API_ACTIVIDADES_UPDATE, modal.getData());
        const { data: data } = await HttpClient.post(API_ACTIVIDADES_LIST, { "diplomado": modal.getField("diplomado").val(), "modulo": modal.getField("modulo").val() });

        TableHelper.update(tableActividades, data);
        modal.close();

        Toast.fire({
            icon: "success",
            title: message
        });
    } catch (error) {
        console.log(error.response ?? error);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: error.message
        });
    } finally {
        modal.buttonOn("save");
    }
}

function deleteDiplomado(diplomado, nombre) {
    Swal.fire({
        title: "¿Quieres borrar este diplomado?",
        text: nombre,
        theme: Theme.getResolved(),
        showCancelButton: true,
        cancelButtonColor: "#6c757d",
        confirmButtonColor: "#dc3545",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, borrar",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                Loader.show();

                const { message: message } = await HttpClient.post(API_DIPLOMADOS_DELETE, { "diplomado": diplomado });
                const { data: data } = await HttpClient.get(API_DIPLOMADOS_LIST);

                TableHelper.update(tableDiplomados, data);
                modulos.slideUp();
                actividades.slideUp();

                Toast.fire({
                    icon: "success",
                    title: message
                });
            } catch (err) {
                console.log(err.response);

                Toast.fire({
                    icon: "error",
                    title: "Ocurrió un error",
                    html: err.message
                });
            } finally {
                Loader.hide();
            }
        }
    });
}

function deleteModulo(diplomado, modulo, nombre) {
    Swal.fire({
        title: "¿Quieres borrar este módulo?",
        text: nombre,
        theme: Theme.getResolved(),
        showCancelButton: true,
        cancelButtonColor: "#6c757d",
        confirmButtonColor: "#dc3545",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, borrar",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const { message: message } = await HttpClient.post(API_MODULOS_DELETE, { "diplomado": diplomado, "modulo": modulo });
                const { data: data } = await HttpClient.post(API_MODULOS_LIST, { "diplomado": modal.getField("diplomado").val() });

                TableHelper.update(tableModulos, data);
                actividades.slideUp();

                Toast.fire({
                    icon: "success",
                    title: message
                });
            } catch (err) {
                console.log(err.response);

                Toast.fire({
                    icon: "error",
                    title: "Ocurrió un error",
                    html: err.message
                });
            }
        }
    });
}

function deleteActividad(diplomado, modulo, actividad, nombre) {
    Swal.fire({
        title: "¿Quieres borrar esta actividad?",
        text: nombre,
        theme: Theme.getResolved(),
        showCancelButton: true,
        cancelButtonColor: "#6c757d",
        confirmButtonColor: "#dc3545",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, borrar",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const { message: message } = await HttpClient.post(API_ACTIVIDADES_DELETE, { "diplomado": diplomado, "modulo": modulo, "actividad": actividad });
                const { data: data } = await HttpClient.post(API_ACTIVIDADES_LIST, { "diplomado": modal.getField("diplomado").val(), "modulo": modal.getField("modulo").val() });

                TableHelper.update(tableActividades, data);

                Toast.fire({
                    icon: "success",
                    title: message
                });
            } catch (err) {
                console.log(err.response);

                Toast.fire({
                    icon: "error",
                    title: "Ocurrió un error",
                    html: err.message
                });
            }
        }
    });
}