const API_CLASES_LIST = API_URL + "grupo/clases/list.php";
const API_CLASES_FORM = API_URL + "grupo/clases/edit-form.php";
const API_CLASES_UPDATE = API_URL + "grupo/clases/update.php";
const API_CLASES_CANCEL = API_URL + "grupo/clases/cancel.php";
const API_CLASES_DELETE = API_URL + "grupo/clases/delete.php";
const API_CLASES_STORE = API_URL + "grupo/clases/store.php";

// Components
let modalClaseCrear;
let modalClaseEditar;

// Tables
let tableClases;

// Tables data
let tableClasesData = [];

// Rules
const rulesClaseCrear = {
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
    },
    "cantidad": {
        name: "Cantidad",
        rules: "required|integer|minValue:1|maxValue:100"
    },
    "cada": {
        name: "Cada cuando",
        rules: "required|integer|minValue:1|maxValue:100"
    },
    "tiempo": {
        name: "Cada cuando",
        rules: "required|integer"
    }
};

const rulesClaseEditar = {
    "fecha": {
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

function initializeClases() {
    initializeClasesComponents();
    initializeClasesDateTimes();
    initializeClasesInputs();
    initializeClasesEvents();
    initializeClasesTables();
}

function initializeClasesComponents() {
    panelClases = new ComponentHelper("#clases");

    modalClaseCrear = new ComponentHelper("#modal-clase-crear");
    modalClaseEditar = new ComponentHelper("#modal-clase-editar");

    initializeClasesComponentActions();
}

function initializeClasesComponentActions() {
    panelClases.onAction("add", async () => {
        try {
            Loader.show();

            modalClaseCrear.clear();

            const result = await HttpClient.post(API_GRUPO_DETAILS, { "grupo": grupoData.getField("id").val() });

            modalClaseCrear.setData({
                "id": result.data.id,
                "fecha-inicio": result.data.fecha_inicio,
                "hora-inicio": result.data.hora_inicio,
                "tolerancia-antes": result.data.tolerancia_antes,
                "tolerancia-despues": result.data.tolerancia_despues
            });

            modalClaseCrear.open();
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
    });

    modalClaseEditar.onAction("save", () => {
        updateClase();
    });

    modalClaseCrear.onAction("add", () => {
        addClases();
    });
}

function initializeClasesDateTimes() {
    DateHelper.date("fecha", { context: modalClaseEditar });
    DateHelper.time("hora-inicio", { context: modalClaseEditar, minuteIncrement: 15 });

    DateHelper.date("fecha-inicio", { context: modalClaseCrear });
    DateHelper.time("hora-inicio", { context: modalClaseCrear, minuteIncrement: 15 });
}

function initializeClasesInputs() {
    InputHelper.digits("tolerancia-antes", {
        context: modalClaseCrear,
        min: 1,
        max: 240
    });

    InputHelper.digits("tolerancia-despues", {
        context: modalClaseCrear,
        min: 1,
        max: 240
    });

    InputHelper.digits("cantidad", {
        context: modalClaseCrear,
        min: 1,
        max: 100
    });

    InputHelper.digits("cada", {
        context: modalClaseCrear,
        min: 1,
        max: 50
    });

    InputHelper.digits("tolerancia-antes", {
        context: modalClaseEditar,
        min: 1,
        max: 240
    });

    InputHelper.digits("tolerancia-despues", {
        context: modalClaseEditar,
        min: 1,
        max: 240
    });
}

function initializeClasesEvents() {
    panelClases
        .getTable("clases")
        .off("click.clases")
        .on("click.clases", "[data-action]", function () {
            const action = $(this).data("action");
            const id = $(this).data("id");

            if (action === "edit") {
                editFormClase(id);
            }

            if (action === "cancel") {
                cancelClase(id, $(this).data("fecha"));
            }

            if (action === "delete") {
                deleteClase(id, $(this).data("fecha"));
            }
        });
}

function initializeClasesTables() {
    initializeTableClases();
}

function initializeTableClases() {
    const columns = [
        {
            data: 'fecha',
            name: 'fecha',
            title: 'Fecha',
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
            data: 'tolerancia_antes',
            name: 'tolerancia_antes',
            title: 'Tolerancia antes',
            render: function (data, type, row) {
                if (type === "display") {
                    return data ? data + " minutos" : "Sin límite";
                }
                return data;
            }
        },
        {
            data: 'tolerancia_despues',
            name: 'tolerancia_despues',
            title: 'Tolerancia después',
            render: function (data, type, row) {
                if (type === "display") {
                    return data ? data + " minutos" : "Sin límite";
                }
                return data;
            }
        },
        {
            data: 'estado',
            name: 'estado',
            title: 'Estatus'
        },
        {
            data: 'asistencias',
            name: 'asistencias',
            title: 'Asistencias'
        },
        {
            data: 'id',
            name: 'actions',
            title: '',
            render: function (data, type, row, meta) {
                if (type === 'display') {
                    data = `
                        <div class="d-flex justify-content-around align-items-stretch">
                            <button type="button" title="Editar clase" class="btn btn-outline-success" data-action="edit" data-id="${data}">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            &nbsp;
                            <button type="button" title="Cancelar clase" class="btn btn-outline-warning" data-action="cancel" data-id="${data}" data-fecha="${row.fecha}">
                                <i class="fa-solid fa-calendar-xmark"></i>
                            </button>
                            &nbsp;
                            <button type="button" title="Eliminar clase " class="btn btn-outline-danger" data-action="delete" data-id="${data}" data-fecha="${row.fecha}">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                        `;
                }
                return data;
            }
        }
    ]

    tableClases = TableHelper.create(
        panelClases,
        "clases",
        {
            columns,
            tableClasesData,
            fixedColumns: { left: 0, right: 1 },
            order: [{ name: "fecha", dir: "asc" }],
            ordering: {
                indicators: false,
                handler: false
            },
            columnControl: [
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
                { targets: "fecha:name", render: DataTable.render.date() }
            ],
            ...TableHelper.exportButtons({
                title: "Clases",
                filename: "clases_" + moment(TODAY).format(formatDateExport),
                buttons: ["ccSearchClear"]
            }),
            exportOptions: {
                columns: ":not(.notexport)"
            }
        }
    );
}

function updateTableClases(data) {
    tableClasesData = data;
    TableHelper.update(tableClases, tableClasesData);
}

async function editFormClase(clase) {
    try {
        Loader.show();

        modalClaseEditar.clear();

        const result = await HttpClient.post(API_CLASES_FORM, { "clase": clase });

        modalClaseEditar.setData({
            "id": clase,
            "fecha": result.data.fecha,
            "hora-inicio": result.data.hora_inicio,
            "tolerancia-antes": result.data.tolerancia_antes,
            "tolerancia-despues": result.data.tolerancia_despues
        });

        modalClaseEditar.open();
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

function cancelClase(clase, fecha) {
    Swal.fire({
        title: `¿Quieres cancelar la clase del ${formatDate(fecha + " ")}?`,
        text: "La clase seguirá aparenciendo en la lista y en las asistencias con estatus de cancelada.",
        theme: Theme.getResolved(),
        reverseButtons: true,
        showCancelButton: true,
        cancelButtonColor: "#6c757d",
        confirmButtonColor: "#dc3545",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, cancelar clase",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                Loader.show();

                const [result, clases, asistencias] = await Promise.all([
                    HttpClient.post(API_CLASES_CANCEL, { "clase": clase }),
                    HttpClient.post(API_CLASES_LIST, { "grupo": grupoData.getField("id").val() }),
                    HttpClient.post(API_ASISTENCIAS_LIST, { "grupo": grupoData.getField("id").val() })
                ]);

                updateTableClases(clases.data);
                updateTableAsistencias(asistencias.data);

                Toast.fire({
                    icon: "success",
                    title: result.data
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

function deleteClase(clase, fecha) {
    Swal.fire({
        title: `¿Quieres borrar la clase del ${formatDate(fecha + " ")}?`,
        text: "Se eliminará la clase y todas las asistencias y justificaciones asociadas a esta, además ya no se mostrará en la lista ni en las asistencias",
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

                const [result, clases, asistencias] = await Promise.all([
                    HttpClient.post(API_CLASES_DELETE, { "clase": clase }),
                    HttpClient.post(API_CLASES_LIST, { "grupo": grupoData.getField("id").val() }),
                    HttpClient.post(API_ASISTENCIAS_LIST, { "grupo": grupoData.getField("id").val() })
                ]);

                updateTableClases(clases.data);
                updateTableAsistencias(asistencias.data);

                Toast.fire({
                    icon: "success",
                    title: result.data
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

async function addClases() {
    if (!validateFields(modalClaseCrear, rulesClaseCrear)) return;

    try {
        Loader.show();

        const [result, clases, asistencias] = await Promise.all([
            HttpClient.post(API_CLASES_STORE, modalClaseCrear.getData()),
            HttpClient.post(API_CLASES_LIST, { "grupo": grupoData.getField("id").val() }),
            HttpClient.post(API_ASISTENCIAS_LIST, { "grupo": grupoData.getField("id").val() })
        ]);

        updateTableClases(clases.data);
        updateTableAsistencias(asistencias.data);

        modalClaseCrear.close();

        Toast.fire({
            icon: "success",
            title: result.data
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

async function updateClase() {
    if (!validateFields(modalClaseEditar, rulesClaseEditar)) return;

    const params = {
        "grupo": grupoData.getField("id").val(),
        ...modalClaseEditar.getData()
    }

    try {
        Loader.show();

        const [clase, clases, asistencias] = await Promise.all([
            HttpClient.post(API_CLASES_UPDATE, params),
            HttpClient.post(API_CLASES_LIST, { "grupo": grupoData.getField("id").val() }),
            HttpClient.post(API_ASISTENCIAS_LIST, { "grupo": grupoData.getField("id").val() })
        ]);

        updateTableClases(clases.data);
        updateTableAsistencias(asistencias.data);

        modalClaseEditar.close();

        Toast.fire({
            icon: "success",
            title: clase.data
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