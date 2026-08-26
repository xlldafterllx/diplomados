const API_ASISTENCIAS_JUSTIFY_FORM = API_URL + "grupo/asistencias/justify-form.php";
const API_ASISTENCIAS_JUSTIFY = API_URL + "grupo/asistencias/justify.php";
const API_ASISTENCIAS_LIST = API_URL + "grupo/asistencias/list.php";

// Components
let panelAsistencia;
let modalJustificar;

// Tables
let tableAsistencia;

// Tables data
let tableAsistenciaData = [];

// Rules
const rulesJustificar = {
    "alumno": {
        name: "Alumno",
        rules: "required|integer"
    },
    "clase": {
        name: "Clase",
        rules: "required|integer"
    },
    "motivo": {
        name: "Motivo",
        rules: "nullable|string"
    },
};

async function initializeAsistencias() {
    initializeAsistenciasComponents();
}

function initializeAsistenciasComponents() {
    panelAsistencia = new ComponentHelper("#asistencia");
    modalJustificar = new ComponentHelper("#modal-justificar");

    initializeAsistenciasComponentActions();
}

function initializeAsistenciasComponentActions() {
    panelAsistencia.onAction("justify", () => {
        formJustificar();
    });

    modalJustificar.onAction("save", async () => {
        storeJustficacion();
    });
}

function updateTableAsistencias(data) {
    const { clases, alumnos, totales } = data;
    const columns = getAsistenciasColumns(clases);

    tableAsistencias = TableHelper.create(
        panelAsistencia,
        "asistencia",
        {
            rebuild: true,
            columns,
            data: alumnos,
            footer: {
                combined: false
            },
            fixedColumns: {
                left: 1,
                right: 1
            },
            order: [
                {
                    name: "alumno",
                    dir: "asc"
                }
            ],
            columnDefs: [
                { targets: "_all", className: "align-content-center dt-head-nowrap dt-head-left dt-body-left dt-foot-left" },
                { targets: "alumno:name", className: "dt-col-medium" },
            ],
            footerCallback: function () {
                renderAsistenciasFooter(
                    this.api(),
                    clases,
                    totales
                );
            },
            ...TableHelper.exportButtons({
                title: "Asistencias",
                filename: "asistencias",
                buttons: [
                    {
                        text: `<i class="fas fa-rotate"></i> Actualizar`,
                        action: function () {
                            loadAsistencias();
                        }
                    }
                ]
            })
        }
    );
}

function getAsistenciasColumns(clases) {
    const columns = [
        {
            data: "alumno",
            title: "Alumno",
            name: "alumno"
        }
    ];

    clases.forEach(clase => {
        columns.push({
            data: null,
            title: clase.fecha,
            name: `clase-${clase.id}`,
            orderable: false,
            render: function (data, type, row) {
                return renderAsistencia(row.clases[clase.id], type);
            }
        });
    });

    columns.push(
        {
            data: "asistencias",
            title: "Asistencias",
            name: "asistencias"
        },
        {
            data: "faltas",
            title: "Faltas",
            name: "faltas"
        },
        {
            data: "justificadas",
            title: "Justificadas",
            name: "justificadas"
        },
        {
            data: "promedio",
            title: "Promedio",
            name: "promedio",
            render: DataTable.render.number(null, null, 1)
        }
    );

    return columns;
}

function renderAsistencia(registro, type) {
    if (!registro) {
        return "-";
    }

    if (type !== "display") {
        switch (registro.estado) {
            case "ASISTENCIA":
                return moment(registro.hora, "HH:mm:ss").format("hh:mm a");
            case "FALTA":
                return "F";
            case "JUSTIFICADA":
                return "J";
            default:
                return "-";
        }
    }

    switch (registro.estado) {
        case "ASISTENCIA":
            return `<span class="text-success fw-bold">${moment(registro.hora, "HH:mm:ss").format("hh:mm a")}</span>`;
        case "FALTA":
            return `<span class="text-danger fw-bold">F</span>`;
        case "JUSTIFICADA":
            return `<span class="text-warning fw-bold">J</span>`;
        default:
            return `<span class="text-secondary">-</span>`;
    }
}

function renderAsistenciasFooter(table, clases, totales) {
    table
        .column("alumno:name")
        .footer()
        .textContent = "Total";

    clases.forEach(clase => {
        table
            .column(`clase-${clase.id}:name`)
            .footer()
            .textContent = totales.clases[clase.id]?.asistencias ?? 0;
    });

    table
        .column("asistencias:name")
        .footer()
        .textContent = totales.asistencias;

    table
        .column("faltas:name")
        .footer()
        .textContent = totales.faltas;

    table
        .column("justificadas:name")
        .footer()
        .textContent = totales.justificadas;

    table
        .column("promedio:name")
        .footer()
        .textContent = Number(totales.promedio).toFixed(1);
}

async function formJustificar() {
    modalJustificar.clear();
    
    try {
        Loader.show();

        const result = await HttpClient.post(API_ASISTENCIAS_JUSTIFY_FORM, { "grupo": grupoData.getField("id").val() });
        const { alumnos, clases } = result.data;

        const options = {
            context: modalJustificar,
            triggerChange: false
        }

        SelectHelper.fill("alumno", alumnos, options);
        SelectHelper.fill("clase", clases, options);

        modalJustificar.open();
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

async function storeJustficacion() {
    if (!validateFields(modalJustificar, rulesJustificar)) return;

    try {
        Loader.show();

        const [justificar, asistencias] = await Promise.all([
            HttpClient.post(API_ASISTENCIAS_JUSTIFY, modalJustificar.getData()),
            HttpClient.post(API_ASISTENCIAS_LIST, { "grupo": grupoData.getField("id").val() })
        ]);

        updateTableAsistencias(asistencias.data);
        
        Toast.fire({
            icon: "success",
            title: justificar.data
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

async function loadAsistencias() {
    
    try {
        Loader.show();
        
        const result = await HttpClient.post(API_ASISTENCIAS_LIST, { "grupo": grupoData.getField("id").val() });

        updateTableAsistencias(result.data);

        Toast.fire({
            icon: "success",
            title: "Datos actualizados."
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