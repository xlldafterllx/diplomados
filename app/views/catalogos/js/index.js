const diplomadosListApi = API_URL + "diplomados/list.php";
const diplomadosStoreApi = API_URL + "diplomados/store.php";
const diplomadosEditApi = API_URL + "diplomados/edit-form.php";
const diplomadosUpdateApi = API_URL + "diplomados/update.php";
const diplomadosDeleteApi = API_URL + "diplomados/delete.php";

const modulosListApi = API_URL + "modulos/list.php";
const modulosStoreApi = API_URL + "modulos/store.php";
const modulosEditApi = API_URL + "modulos/edit-form.php";
const modulosUpdateApi = API_URL + "modulos/update.php";
const modulosDeleteApi = API_URL + "modulos/delete.php";

const actividadesListApi = API_URL + "actividades/list.php";
const actividadesStoreApi = API_URL + "actividades/store.php";
const actividadesEditApi = API_URL + "actividades/edit-form.php";
const actividadesUpdateApi = API_URL + "actividades/update.php";
const actividadesDeleteApi = API_URL + "actividades/delete.php";

// Components
let diplomados;
let modulos;
let actividades;
let modal;

// Tables
let tableDiplomados;
let tableModulos;
let tableActividades;

// Tables data
let tableDiplomadosData = [];
let tableModulosData = [];
let tableActividadesData = [];

$(function () {
    initialize();
});

function initialize() {
    window.HttpClient = HttpClient;
    window.HttpException = HttpException;
    components();
    tables();
    loadDiplomados();
}

function components() {
    diplomados = new ComponentHelper("#diplomados");
    modulos = new ComponentHelper("#modulos");
    actividades = new ComponentHelper("#actividades");
    modal = new ComponentHelper("#modal-generic");

    cmpValidationFields();
    cmpActions();
}

function cmpValidationFields() {
    modal.setMandatoryFields([
        { field: "nombre", name: "Nombre", type: "input" }
    ]);
}

function cmpActions() {
    diplomados.onAction("new", () => {
        modal.getBind("title").text("Agregar diplomado");
        modal.getBind("name").text("Nombre del diplomado");
        modal.getContainer("button").attr("data-action", "save");
        modal.getContainer("value").attr("data-value", "diplomado");
        modal.getField("nombre").val("");
        modal.open();
    });

    modulos.onAction("new", () => {
        modal.getBind("title").text("Agregar módulo");
        modal.getBind("name").text("Nombre del módulo");
        modal.getContainer("button").attr("data-action", "save");
        modal.getContainer("value").attr("data-value", "modulo");
        modal.getField("nombre").val("");
        modal.open();
    });

    actividades.onAction("new", () => {
        modal.getBind("title").text("Agregar actividad");
        modal.getBind("name").text("Nombre de la actividad");
        modal.getContainer("button").attr("data-action", "save");
        modal.getContainer("value").attr("data-value", "actividad");
        modal.getField("nombre").val("");
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

function tables() {
    tblDiplomados();
    tblModulos();
    tblActividades();
}

function tblDiplomados() {
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
                    data =
                        '<div class="d-flex justify-content-around align-items-stretch">' +
                        '<button type="button" title="Ver módulos" class="btn btn-outline-primary" onclick="loadModulos(' + data + ', \'' + row["nombre"] + '\'' + ')">' +
                        '<i class="fa-solid fa-file-arrow-down"></i>' +
                        '</button>' +
                        '&nbsp' +
                        '<button type="button" title="Editar diplomado" class="btn btn-outline-success" onclick="editDiplomado(' + data + ')">' +
                        '<i class="fa-solid fa-pen-to-square"></i>' +
                        '</button>' +
                        '&nbsp' +
                        '<button type="button" title="Eliminar diplomado" class="btn btn-outline-danger" onclick="deleteDiplomado(' + data + ', \'' + row["nombre"] + '\'' + ')">' +
                        '<i class="fa-solid fa-trash-can"></i>' +
                        '</button>' +
                        '</div>';
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
            tableDiplomadosData,
            fixedColumns: { left: 0, right: 1 },
            order: [{ name: "nombre", dir: "asc" }],
            columnDefs: [
                { targets: "actions:name", width: 1, orderable: false, className: "notexport" },
                { targets: "_all", className: "align-content-center dt-head-nowrap dt-head-left dt-body-left" }
            ],
            ...TableHelper.exportButtons({
                title: "Diplomados",
                filename: "diplomados_" + moment(TODAY).format(formatDateExport)
            }),
            exportOptions: {
                columns: ":not(.notexport)"
            }
        }
    );
}

function tblModulos() {
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
                    data =
                        '<div class="d-flex justify-content-around align-items-stretch">' +
                        '<button type="button" title="Ver actividades" class="btn btn-outline-primary" onclick="loadActividades(' + row["diplomado_id"] + ', ' + data + ', \'' + row["nombre"] + '\'' + ')">' +
                        '<i class="fa-solid fa-file-arrow-down"></i>' +
                        '</button>' +
                        '&nbsp' +
                        '<button type="button" title="Editar módulo" class="btn btn-outline-success" onclick="editModulo(' + row["diplomado_id"] + ', ' + data + ')">' +
                        '<i class="fa-solid fa-pen-to-square"></i>' +
                        '</button>' +
                        '&nbsp' +
                        '<button type="button" title="Eliminar módulo" class="btn btn-outline-danger" onclick="deleteModulo(' + row["diplomado_id"] + ', ' + data + ', \'' + row["nombre"] + '\'' + ')">' +
                        '<i class="fa-solid fa-trash-can"></i>' +
                        '</button>' +
                        '</div>';
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
            tableModulosData,
            fixedColumns: { left: 0, right: 1 },
            order: [{ name: "orden", dir: "asc" }],
            columnDefs: [
                { targets: "actions:name", width: 1, orderable: false, className: "notexport" },
                { targets: "_all", className: "align-content-center dt-head-nowrap dt-head-left dt-body-left" }
            ],
            ...TableHelper.exportButtons({
                title: "Modulos",
                filename: "modulos_" + moment(TODAY).format(formatDateExport)
            }),
            exportOptions: {
                columns: ":not(.notexport)"
            }
        }
    );
}

function tblActividades() {
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
                    data =
                        '<div class="d-flex justify-content-around align-items-stretch">' +
                        '<button type="button" title="Editar actividad" class="btn btn-outline-success" onclick="editActividad(' + row["diplomado_id"] + ', ' + row["modulo_id"] + ', ' + data + ')">' +
                        '<i class="fa-solid fa-pen-to-square"></i>' +
                        '</button>' +
                        '&nbsp' +
                        '<button type="button" title="Eliminar actividad" class="btn btn-outline-danger" onclick="deleteActividad(' + row["diplomado_id"] + ', ' + row["modulo_id"] + ', ' + data + ', \'' + row["nombre"] + '\'' + ')">' +
                        '<i class="fa-solid fa-trash-can"></i>' +
                        '</button>' +
                        '</div>';
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
            tableActividadesData,
            fixedColumns: { left: 0, right: 1 },
            order: [{ name: "orden", dir: "asc" }],
            columnDefs: [
                { targets: "actions:name", width: 1, orderable: false, className: "notexport" },
                { targets: "_all", className: "align-content-center dt-head-nowrap dt-head-left dt-body-left" }
            ],
            ...TableHelper.exportButtons({
                title: "Actividades",
                filename: "actividades_" + moment(TODAY).format(formatDateExport)
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

        const result = await HttpClient.post(diplomadosListApi, {});
        tableDiplomadosData = result.data;

        TableHelper.update(tableDiplomados, tableDiplomadosData);
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

async function loadModulos(diplomado, nombre) {
    try {
        Loader.show();
        actividades.slideUp();

        modulos.getBind("title").text("Módulos del diplomado " + nombre.toLowerCase());

        const result = await HttpClient.post(modulosListApi, { "diplomado": diplomado });
        tableModulosData = result.data;

        TableHelper.update(tableModulos, tableModulosData);

        modal.getField("diplomado").val(diplomado);
    } catch (err) {
        console.log(err.response);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: err.message
        });
    } finally {
        modulos.slideDown();
        scrollToElement(modulos);
        Loader.hide();
    }
}

async function loadActividades(diplomado, modulo, nombre) {
    try {
        Loader.show();

        actividades.getBind("title").text("Actividades del módulo " + nombre.toLowerCase());

        const result = await HttpClient.post(actividadesListApi, { "diplomado": diplomado, "modulo": modulo });
        tableActividadesData = result.data;

        TableHelper.update(tableActividades, tableActividadesData);

        modal.getField("diplomado").val(diplomado);
        modal.getField("modulo").val(modulo);
    } catch (err) {
        console.log(err.response);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: err.message
        });
    } finally {
        actividades.slideDown();
        scrollToElement(actividades);
        Loader.hide();
    }
}

async function updateDiplomadosData() {
    try {
        Loader.show();

        const result = await HttpClient.post(diplomadosListApi, {});
        tableDiplomadosData = result.data;

        TableHelper.update(tableDiplomados, tableDiplomadosData);
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

async function updateModulosData(diplomado) {
    try {
        Loader.show();

        const result = await HttpClient.post(modulosListApi, { "diplomado": diplomado });
        tableModulosData = result.data;

        TableHelper.update(tableModulos, tableModulosData);

        modal.getField("diplomado").val(diplomado);
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

async function updateActividadesData(diplomado, modulo) {
    try {
        Loader.show();

        const result = await HttpClient.post(actividadesListApi, { "diplomado": diplomado, "modulo": modulo });
        tableActividadesData = result.data;

        TableHelper.update(tableActividades, tableActividadesData);

        modal.getField("diplomado").val(diplomado);
        modal.getField("modulo").val(modulo);
    } catch (err) {
        console.log(err.response);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: err.message
        });
    } finally {
        actividades.slideDown();
        scrollToElement(actividades);
        Loader.hide();
    }
}

async function newDiplomado() {
    if (!modal.validateMandatory()) return;
    modal.buttonOff("save");

    try {
        const result = await HttpClient.post(diplomadosStoreApi, modal.getData());
        updateDiplomadosData();
        modal.close();

        Toast.fire({
            icon: "success",
            title: "Diplomado creado"
        });
    } catch (err) {
        console.log(err.response);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: err.message
        });
    } finally {
        modal.buttonOn("save");
    }
}

async function newModulo() {
    if (!modal.validateMandatory()) return;
    modal.buttonOff("save");

    try {
        const result = await HttpClient.post(modulosStoreApi, modal.getData());
        updateModulosData(modal.getField("diplomado").val());
        modal.close();

        Toast.fire({
            icon: "success",
            title: "Módulo creado"
        });
    } catch (err) {
        console.log(err.response);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: err.message
        });
    } finally {
        modal.buttonOn("save");
    }
}

async function newActividad() {
    if (!modal.validateMandatory()) return;
    modal.buttonOff("save");

    try {
        const result = await HttpClient.post(actividadesStoreApi, modal.getData());
        updateActividadesData(modal.getField("diplomado").val(), modal.getField("modulo").val());
        modal.close();

        Toast.fire({
            icon: "success",
            title: "Actividad creada"
        });
    } catch (err) {
        console.log(err.response);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: err.message
        });
    } finally {
        modal.buttonOn("save");
    }
}

async function editDiplomado(diplomado) {
    try {
        Loader.show();

        modal.getBind("title").text("Editar diplomado");
        modal.getBind("name").text("Nombre del diplomado");
        modal.getContainer("button").attr("data-action", "update");
        modal.getContainer("value").attr("data-value", "diplomado");
        modal.getField("diplomado").val(diplomado);

        const result = await HttpClient.post(diplomadosEditApi, { "diplomado": diplomado });
        modal.getField("nombre").val(result.data);
    } catch (err) {
        console.log(err.response);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: err.message
        });
    } finally {
        Loader.hide();
        modal.open();
    }
}

async function editModulo(diplomado, modulo) {
    try {
        Loader.show();

        modal.getBind("title").text("Editar modulo");
        modal.getBind("name").text("Nombre del modulo");
        modal.getContainer("button").attr("data-action", "update");
        modal.getContainer("value").attr("data-value", "modulo");
        modal.getField("diplomado").val(diplomado);
        modal.getField("modulo").val(modulo);

        const result = await HttpClient.post(modulosEditApi, { "diplomado": diplomado, "modulo": modulo });
        modal.getField("nombre").val(result.data);
    } catch (err) {
        console.log(err.response);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: err.message
        });
    } finally {
        Loader.hide();
        modal.open();
    }
}

async function editActividad(diplomado, modulo, actividad) {
    try {
        Loader.show();

        modal.getBind("title").text("Editar actividad");
        modal.getBind("name").text("Nombre de la actividad");
        modal.getContainer("button").attr("data-action", "update");
        modal.getContainer("value").attr("data-value", "actividad");
        modal.getField("diplomado").val(diplomado);
        modal.getField("modulo").val(modulo);
        modal.getField("actividad").val(actividad);

        const result = await HttpClient.post(actividadesEditApi, { "diplomado": diplomado, "modulo": modulo, "actividad": actividad });
        modal.getField("nombre").val(result.data);
    } catch (err) {
        console.log(err.response);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: err.message
        });
    } finally {
        Loader.hide();
        modal.open();
    }
}

async function updateDiplomado() {
    if (!modal.validateMandatory()) return;
    modal.buttonOff("save");

    try {
        const result = await HttpClient.post(diplomadosUpdateApi, modal.getData());
        updateDiplomadosData();
        modal.close();

        Toast.fire({
            icon: "success",
            title: "Diplomado actualizado"
        });
    } catch (err) {
        console.log(err.response);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: err.message
        });
    } finally {
        modal.buttonOn("save");
    }
}

async function updateModulo() {
    if (!modal.validateMandatory()) return;
    modal.buttonOff("save");

    try {
        const result = await HttpClient.post(modulosUpdateApi, modal.getData());
        updateModulosData(modal.getField("diplomado").val());
        modal.close();

        Toast.fire({
            icon: "success",
            title: "Módulo actualizado"
        });
    } catch (err) {
        console.log(err.response);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: err.message
        });
    } finally {
        modal.buttonOn("save");
    }
}

async function updateActividad() {
    if (!modal.validateMandatory()) return;
    modal.buttonOff("save");

    try {
        const result = await HttpClient.post(actividadesUpdateApi, modal.getData());
        updateActividadesData(modal.getField("diplomado").val(), modal.getField("modulo").val());
        modal.close();

        Toast.fire({
            icon: "success",
            title: "Actividad actualizada"
        });
    } catch (err) {
        console.log(err.response);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: err.message
        });
    } finally {
        modal.buttonOn("save");
    }
}

function deleteDiplomado(diplomado, nombre) {
    Swal.fire({
        title: "¿Quieres borrar este diplomado?",
        text: nombre,
        theme: "auto",
        reverseButtons: true,
        showCancelButton: true,
        cancelButtonColor: "#6c757d",
        confirmButtonColor: "#dc3545",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, borrar",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const result = await HttpClient.post(diplomadosDeleteApi, { "diplomado": diplomado });
                updateDiplomadosData();
                modulos.slideUp();
                actividades.slideUp();

                Toast.fire({
                    icon: "success",
                    title: "Diplomado eliminado"
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

function deleteModulo(diplomado, modulo, nombre) {
    Swal.fire({
        title: "¿Quieres borrar este módulo?",
        text: nombre,
        theme: "auto",
        reverseButtons: true,
        showCancelButton: true,
        cancelButtonColor: "#6c757d",
        confirmButtonColor: "#dc3545",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, borrar",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const result = await HttpClient.post(modulosDeleteApi, { "diplomado": diplomado, "modulo": modulo });
                updateModulosData(diplomado);
                actividades.slideUp();

                Toast.fire({
                    icon: "success",
                    title: "Módulo eliminado"
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
        theme: "auto",
        reverseButtons: true,
        showCancelButton: true,
        cancelButtonColor: "#6c757d",
        confirmButtonColor: "#dc3545",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, borrar",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const result = await HttpClient.post(actividadesDeleteApi, { "diplomado": diplomado, "modulo": modulo, "actividad": actividad });
                updateActividadesData(diplomado, modulo);

                Toast.fire({
                    icon: "success",
                    title: "Actividad eliminada"
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