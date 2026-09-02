const API_GRUPOS_LIST = API_URL + "grupos/list.php";
const API_GRUPO_ALL = API_URL + "grupo/all.php";
const API_GRUPO_STORE = API_URL + "grupo/store.php";
const API_GRUPO_EDIT = API_URL + "grupo/edit-form.php";
const API_GRUPO_UPDATE = API_URL + "grupo/update.php";
const API_GRUPO_DELETE = API_URL + "grupo/delete.php";
const API_GRUPO_DETAILS = API_URL + "grupo/details.php";

// Components
let grupos;
let grupoData;
let modalGrupo;

// Tables
let tableGrupos;

// Tables data
let tableGruposData = [];

// Rules
const rulesGrupo = {
    "nombre": {
        name: "Nombre",
        rules: "required|string"
    },
    "diplomado": {
        name: "Diplomado",
        rules: "required|integer"
    },
    "fecha-inicio": {
        name: "Fecha de inicio",
        rules: "required|date"
    },
    "hora-inicio": {
        name: "Hora de inicio",
        rules: "required|string"
    },
    "tolerancia-antes": {
        name: "Tolerancia antes",
        rules: "nullable|integer|minValue:1|maxValue:240"
    },
    "tolerancia-despues": {
        name: "Tolerancia después",
        rules: "nullable|integer|minValue:1|maxValue:240"
    }
};

function initializeGrupos() {
    initializeGruposComponents();
    initializeGruposSelects();
    initializeGruposDateTimes();
    initializeGruposInputs();
    initializeGruposEvents();
    initializeGruposTables();
}

function initializeGruposComponents() {
    grupos = new ComponentHelper("#grupos");
    grupoData = new ComponentHelper("#grupo-data");
    modalGrupo = new ComponentHelper("#modal-grupo");

    initializeGruposComponentActions();
}

function initializeGruposComponentActions() {
    grupos.onAction("add", () => {
        modalGrupo.clear();
        modalGrupo.getBind("title").text("Crear grupo");
        modalGrupo.getContainer("button").attr("data-action", "save");
        modalGrupo.open();
    });

    modalGrupo.onAction("save", () => {
        storeGrupo();
    });

    modalGrupo.onAction("update", () => {
        updateGrupo();
    });
}

function initializeGruposSelects() {
    const options = {
        context: modalGrupo,
        triggerChange: false
    }

    SelectHelper.fill("diplomado", [], options);
}

function initializeGruposDateTimes() {
    DateHelper.date("fecha-inicio", { context: modalGrupo });
    DateHelper.time("hora-inicio", { context: modalGrupo, minuteIncrement: 15 });
}

function initializeGruposInputs() {
    InputHelper.digits("tolerancia-antes", {
        context: modalGrupo,
        min: 1,
        max: 240
    });

    InputHelper.digits("tolerancia-despues", {
        context: modalGrupo,
        min: 1,
        max: 240
    });
}

function initializeGruposEvents() {
    grupos
        .getTable("grupos")
        .off("click.grupos")
        .on("click.grupos", "[data-action]", function () {
            const action = $(this).data("action");
            const id = $(this).data("id");

            if (action === "load") {
                loadDataGrupo(id);
            }

            if (action === "edit") {
                editFormGrupo(id);
            }

            if (action === "delete") {
                const nombre = $(this).data("nombre");
                deleteGrupo(id, decodeURIComponent(nombre));
            }
        });
}

function initializeGruposTables() {
    initializeTableGrupos();
}

function initializeTableGrupos() {
    const columns = [
        {
            data: 'grupo_nombre',
            name: 'grupo_nombre',
            title: 'Nombre'
        },
        {
            data: 'diplomado_nombre',
            name: 'diplomado_nombre',
            title: 'Diplomado'
        },
        {
            data: 'fecha_inicio',
            name: 'fecha_inicio',
            title: 'Fecha de inicio',
            render: DataTable.render.datetime('DD/MM/YYYY')
        },
        {
            data: 'hora_inicio',
            name: 'hora_inicio',
            title: 'A las',
            render: function (data, type, row) {
                if (type === "display") {
                    return moment(data, "HH:mm:ss").format("hh:mm a");
                }
                return data;
            }
        },
        {
            data: 'fecha_creacion',
            name: 'fecha_creacion',
            title: 'Fecha de creación',
            render: DataTable.render.datetime('DD/MM/YYYY h:mm a')
        },
        {
            data: 'id',
            name: 'actions',
            title: '',
            render: function (data, type, row, meta) {
                if (type === 'display') {
                    data = `
                        <div class="d-flex justify-content-around align-items-stretch">
                            <button type="button" title="Cargar datos" class="btn btn-outline-primary" data-action="load" data-id="${data}">
                                <i class="fa-solid fa-file-arrow-down"></i>
                            </button>
                            &nbsp;
                            <button type="button" title="Editar grupo" class="btn btn-outline-success" data-action="edit" data-id="${data}">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            &nbsp;
                            <button type="button" title="Eliminar grupo" class="btn btn-outline-danger" data-action="delete" data-id="${data}" data-nombre="${encodeURIComponent(row.grupo_nombre)}">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                        `;
                }
                return data;
            }
        }
    ]

    tableGrupos = TableHelper.create(
        grupos,
        "grupos",
        {
            columns,
            tableGruposData,
            fixedColumns: { left: 0, right: 1 },
            order: [{ name: "fecha_creacion", dir: "desc" }],
            ordering: {
                indicators: false,
                handler: false
            },
            columnControl: [
                //"order",
                [
                    "orderAsc",
                    "orderDesc",
                    "spacer",
                    "orderAddAsc",
                    "orderAddDesc",
                    "orderRemove",
                    "spacer",
                    "orderClear"
                ],
                "searchDropdown"
            ],
            columnDefs: [
                { targets: "actions:name", width: 1, orderable: false, className: "notexport", columnControl: [] },
                { targets: "_all", className: "align-content-center dt-head-nowrap dt-head-left dt-body-left" },
                { targets: ["diplomado_nombre:name", "fecha_creacion:name"], className: "dt-body-nowrap" },
                { targets: "fecha_creacion:name", render: DataTable.render.date() }
            ],
            ...TableHelper.exportButtons({
                title: "Grupos",
                filename: "grupos_" + moment(TODAY).format(formatDateExport),
                buttons: ["ccSearchClear"]
            }),
            exportOptions: {
                columns: ":not(.notexport)"
            }
        }
    );
}

function updateTableGrupos(data) {
    tableGruposData = data;
    TableHelper.update(tableGrupos, tableGruposData);
}

async function loadDataGrupo(grupo) {
    try {
        Loader.show();

        const result = await HttpClient.post(API_GRUPO_ALL, { "grupo": grupo });
        const { detalle, alumnos, clases, asistencias } = result.data;

        grupoData.getField("id").val(detalle.id);
        grupoData.getField("url").prop("href", detalle.asistencia_url);

        const tolAntes = detalle.tolerancia_antes ? detalle.tolerancia_antes + " minutos" : "Sin límite";
        const tolDespues = detalle.tolerancia_despues ? detalle.tolerancia_despues + " minutos" : "Sin límite";

        grupoData.setBinds({
            "nombre": detalle.grupo_nombre,
            "diplomado": detalle.diplomado_nombre,
            "fecha-inicio": formatDate(detalle.fecha_inicio + " "),
            "hora-inicio": formatTime(TODAY + " " + detalle.hora_inicio),
            "fecha-creacion": formatDateTime(detalle.fecha_creacion),
            "tolerancia-antes": tolAntes,
            "tolerancia-despues": tolDespues,
            "alumnos": detalle.alumnos,
            "usuario-creacion": detalle.usuario_creacion,
            "url": detalle.asistencia_url
        });

        updateTableAlumnos(alumnos);
        updateTableClases(clases);
        updateTableAsistencias(asistencias);

        grupoData.slideDown();
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

async function editFormGrupo(grupo) {
    try {
        Loader.show();

        modalGrupo.clear();
        modalGrupo.getBind("title").text("Editar grupo");
        modalGrupo.getContainer("button").attr("data-action", "update");

        const result = await HttpClient.post(API_GRUPO_EDIT, { "grupo": grupo });

        modalGrupo.setData({
            "id": grupo,
            "nombre": result.data.nombre,
            "diplomado": result.data.diplomado,
            "fecha-inicio": result.data.fecha_inicio,
            "hora-inicio": result.data.hora_inicio,
            "tolerancia-antes": result.data.tolerancia_antes,
            "tolerancia-despues": result.data.tolerancia_despues
        });

        modalGrupo.open();
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

function deleteGrupo(grupo, nombre) {
    Swal.fire({
        title: `¿Quieres borrar el grupo ${nombre}?`,
        text: "Todas las clases y asistencias se perderan.",
        theme: Theme.getResolved(),
        reverseButtons: true,
        showCancelButton: true,
        cancelButtonColor: "#6c757d",
        confirmButtonColor: "#dc3545",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, borrar",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                Loader.show();

                const [result, grupos] = await Promise.all([
                    HttpClient.post(API_GRUPO_DELETE, { "grupo": grupo }),
                    HttpClient.post(API_GRUPOS_LIST, {})
                ]);

                updateTableGrupos(grupos.data);

                if (grupoData.getField("id").val() == grupo)
                    grupoData.slideUp();

                Toast.fire({
                    icon: "success",
                    title: "Grupo eliminado."
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
    });
}

async function storeGrupo() {
    if (!validateFields(modalGrupo, rulesGrupo)) return;

    try {
        Loader.show();

        const [result, grupos] = await Promise.all([
            HttpClient.post(API_GRUPO_STORE, modalGrupo.getData()),
            HttpClient.post(API_GRUPOS_LIST, {})
        ]);

        updateTableGrupos(grupos.data);

        modalGrupo.close();

        Toast.fire({
            icon: "success",
            title: "Grupo creado."
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

async function updateGrupo() {
    if (!validateFields(modalGrupo, rulesGrupo)) return;

    try {
        Loader.show();

        const [result, grupos, grupo] = await Promise.all([
            HttpClient.post(API_GRUPO_UPDATE, modalGrupo.getData()),
            HttpClient.post(API_GRUPOS_LIST, {}),
            HttpClient.post(API_GRUPO_DETAILS, { "grupo": modalGrupo.getField("id").val() })
        ]);

        updateTableGrupos(grupos.data);

        if (grupoData.getField("id").val() == modalGrupo.getField("id").val())
            updateGrupoData(grupo.data);

        modalGrupo.close();

        Toast.fire({
            icon: "success",
            title: "Grupo actualizado."
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

function updateGrupoData(data) {
    grupoData.getField("id").val(data.id);
    grupoData.getField("url").prop("href", data.asistencia_url);

    const tolAntes = data.tolerancia_antes ? data.tolerancia_antes + " minutos" : "Sin límite";
    const tolDespues = data.tolerancia_despues ? data.tolerancia_despues + " minutos" : "Sin límite";

    grupoData.setBinds({
        "nombre": data.grupo_nombre,
        "diplomado": data.diplomado_nombre,
        "fecha-inicio": formatDate(data.fecha_inicio + " "),
        "hora-inicio": formatTime(TODAY + " " + data.hora_inicio),
        "fecha-creacion": formatDateTime(data.fecha_creacion),
        "tolerancia-antes": tolAntes,
        "tolerancia-despues": tolDespues,
        "alumnos": data.alumnos,
        "usuario-creacion": data.usuario_creacion,
        "url": data.asistencia_url
    });
}