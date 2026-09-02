const API_ALUMNOS_LIST = API_URL + "grupo/alumnos/list.php";
const API_ALUMNOS_LISTBY = API_URL + "grupo/alumnos/list-by.php";
const API_ALUMNOS_EDIT = API_URL + "grupo/alumnos/edit-form.php";
const API_ALUMNOS_UPDATE = API_URL + "grupo/alumnos/update.php";
const API_ALUMNOS_REMOVE = API_URL + "grupo/alumnos/remove.php";
const API_ALUMNOS_STORE = API_URL + "grupo/alumnos/store.php";

// Components
let panelAlumnos;
let modalAlumno;

// Tables
let tableAlumnos;

// Tables data
let tableAlumnosData = [];

// Rules
const rulesAlumno = {
    "nombre": {
        name: "Nombre",
        rules: "required|string"
    },
    "apellido-1": {
        name: "Primer apellido",
        rules: "required|string"
    },
    "apellido-2": {
        name: "Segundo apellido",
        rules: "nullable|string"
    },
    "correo": {
        name: "Correo electrónico",
        rules: "required|email"
    },
    "institucion": {
        name: "Institución",
        rules: "required|string"
    }
};

async function loadAlumnosOnce() {
    if (panelState.alumnos) {
        return;
    }

    await loadAlumnos();

    panelState.alumnos = true;
}

function initializeAlumnos() {
    initializeAlumnosComponents();
    initializeAutocomplete();
    initializeAlumnosEvents();
    initializeAlumnosTables();
}

function initializeAlumnosComponents() {
    panelAlumnos = new ComponentHelper("#alumnos");
    modalAlumno = new ComponentHelper("#modal-alumno");

    initializeAlumnosComponentActions();
}

function initializeAlumnosComponentActions() {
    panelAlumnos.onAction("add", () => {
        modalAlumno.clear();
        modalAlumno.getBind("title").text("Agregar alumno");
        modalAlumno.getContainer("button").attr("data-action", "save");
        modalAlumno.getContainer("buscar").show();
        modalAlumno.open();
    });

    modalAlumno.onAction("save", () => {
        addAlumno();
    });

    modalAlumno.onAction("update", () => {
        updateAlumno();
    });
}

function initializeAutocomplete() {
    initializeAlumnoAutocomplete();
}

function initializeAlumnoAutocomplete() {
    new AutocompleteHelper(modalAlumno.getField("buscar"), {
        minLength: 3,
        maxItems: 20,
        source: async (term) => {
            try {
                const result = await HttpClient.post(API_ALUMNOS_LISTBY, { "palabra": term });
                return result.data;
            } catch (error) {
                console.log(error.response ?? error);

                Toast.fire({
                    icon: "error",
                    title: "Ocurrió un error",
                    html: error.message
                });
                return [];
            }
        },
        renderItem: (ul, item) => {
            const nombre = [
                item.nombre,
                item.apellido_1,
                item.apellido_2
            ]
                .filter(Boolean)
                .join(" ");

            return $("<li>")
                .append(
                    $("<div>")
                        .append(
                            $("<div>")
                                .addClass("fw-semibold")
                                .text(nombre)
                        )
                        .append(
                            $("<small>")
                                .addClass("text-body-secondary")
                                .text(item.correo)
                        )
                )
                .appendTo(ul);
        },
        onSelect: (event, item) => {
            setAlumno(item);
        }
    });
}

function initializeAlumnosEvents() {
    panelAlumnos
        .getTable("alumnos")
        .off("click.alumnos")
        .on("click.alumnos", "[data-action]", function () {
            const action = $(this).data("action");
            const id = $(this).data("id");

            if (action === "edit") {
                editFormAlumno(id);
            }

            if (action === "delete") {
                const nombre = $(this).data("nombre");
                removeAlumno(id, decodeURIComponent(nombre));
            }
        });
}

function initializeAlumnosTables() {
    initializeTableAlumnos();
}

function initializeTableAlumnos() {
    const columns = [
        {
            data: 'nombre',
            name: 'nombre',
            title: 'Nombre'
        },
        {
            data: 'apellido_1',
            name: 'apellido_1',
            title: 'Primer apellido'
        },
        {
            data: 'apellido_2',
            name: 'apellido_2',
            title: 'Segundo apellido'
        },
        {
            data: 'correo',
            name: 'correo',
            title: 'Correo',
        },
        {
            data: 'institucion',
            name: 'institucion',
            title: 'Institución',
        },
        {
            data: 'inscrito',
            name: 'inscrito',
            title: 'Fecha de inscripción',
            render: DataTable.render.datetime('DD/MM/YYYY')
        },
        {
            data: 'id',
            name: 'actions',
            title: '',
            render: function (data, type, row, meta) {
                if (type === 'display') {
                    data = `
                        <div class="d-flex justify-content-around align-items-stretch">
                            <button type="button" title="Editar alumno" class="btn btn-outline-success" data-action="edit" data-id="${data}">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            &nbsp;
                            <button type="button" title="Expulsar del grupo" class="btn btn-outline-danger" data-action="delete" data-id="${data}" data-nombre="${encodeURIComponent(row["nombre"] + " " + row["apellido_1"] + " " + row["apellido_2"])}">
                                <i class="fa-solid fa-user-slash"></i>
                            </button>
                        </div>
                        `;
                }
                return data;
            }
        }
    ]

    tableAlumnos = TableHelper.create(
        panelAlumnos,
        "alumnos",
        {
            columns,
            tableAlumnosData,
            fixedColumns: { left: 0, right: 1 },
            order: [{ name: "nombre", dir: "asc" }],
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
                { targets: "nombre:name", className: "dt-body-nowrap" },
                { targets: "institucion:name", className: "dt-col-large" },
                { targets: "inscrito:name", render: DataTable.render.date() }
            ],
            ...TableHelper.exportButtons({
                title: "Alumnos",
                filename: "alumnos_" + moment(TODAY).format(formatDateExport),
                buttons: ["ccSearchClear"]
            }),
            exportOptions: {
                columns: ":not(.notexport)"
            }
        }
    );
}

function updateTableAlumnos(data) {
    tableAlumnosData = data;
    TableHelper.update(tableAlumnos, tableAlumnosData);
}

function setAlumno(item) {
    modalAlumno.clear();
    modalAlumno.setData({
        "id": item.id,
        "nombre": item.nombre,
        "apellido-1": item.apellido_1,
        "apellido-2": item.apellido_2,
        "correo": item.correo,
        "institucion": item.institucion
    });
}

async function editFormAlumno(alumno) {
    try {
        Loader.show();

        modalAlumno.clear();
        modalAlumno.getBind("title").text("Editar alumno");
        modalAlumno.getContainer("button").attr("data-action", "update");
        modalAlumno.getContainer("buscar").hide();

        const result = await HttpClient.post(API_ALUMNOS_EDIT, { "alumno": alumno });

        modalAlumno.setData({
            "id": result.data.id,
            "nombre": result.data.nombre,
            "apellido-1": result.data.apellido_1,
            "apellido-2": result.data.apellido_2,
            "correo": result.data.correo,
            "institucion": result.data.institucion
        });

        modalAlumno.open();
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

function removeAlumno(alumno, nombre) {
    Swal.fire({
        title: `¿Quieres explulsar a ${nombre} del grupo?`,
        theme: Theme.getResolved(),
        reverseButtons: true,
        showCancelButton: true,
        cancelButtonColor: "#6c757d",
        confirmButtonColor: "#dc3545",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, expulsar",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const [result, grupo, alumnos, asistencias] = await Promise.all([
                    HttpClient.post(API_ALUMNOS_REMOVE, { "alumno": alumno, "grupo": grupoData.getField("id").val() }),
                    HttpClient.post(API_GRUPO_DETAILS, { "grupo": grupoData.getField("id").val() }),
                    HttpClient.post(API_ALUMNOS_LIST, { "grupo": grupoData.getField("id").val() }),
                    HttpClient.post(API_ASISTENCIAS_LIST, { "grupo": grupoData.getField("id").val() })
                ]);

                updateGrupoData(grupo.data);
                updateTableAlumnos(alumnos.data);
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
            }
        }
    });
}

async function addAlumno() {
    if (!validateFields(modalAlumno, rulesAlumno)) return;

    try {
        Loader.show();

        const params = {
            "grupo": grupoData.getField("id").val(),
            ...modalAlumno.getData()
        }

        const [result, grupo, alumnos, asistencias] = await Promise.all([
            HttpClient.post(API_ALUMNOS_STORE, params),
            HttpClient.post(API_GRUPO_DETAILS, { "grupo": grupoData.getField("id").val() }),
            HttpClient.post(API_ALUMNOS_LIST, { "grupo": grupoData.getField("id").val() }),
            HttpClient.post(API_ASISTENCIAS_LIST, { "grupo": grupoData.getField("id").val() })
        ]);

        updateGrupoData(grupo.data);
        updateTableAlumnos(alumnos.data);
        updateTableAsistencias(asistencias.data);

        modalAlumno.close();

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

async function updateAlumno() {
    if (!validateFields(modalAlumno, rulesAlumno)) return;

    try {
        Loader.show();
        const [result, alumnos, asistencias] = await Promise.all([
            HttpClient.post(API_ALUMNOS_UPDATE, modalAlumno.getData()),
            HttpClient.post(API_ALUMNOS_LIST, { "grupo": grupoData.getField("id").val() }),
            HttpClient.post(API_ASISTENCIAS_LIST, { "grupo": grupoData.getField("id").val() })
        ]);

        updateTableAlumnos(alumnos.data);
        updateTableAsistencias(asistencias.data);

        modalAlumno.close();

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