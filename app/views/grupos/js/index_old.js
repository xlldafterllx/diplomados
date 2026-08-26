const API_GRUPOS_ALL = API_URL + "grupos/all.php";
const API_GRUPOS_LIST = API_URL + "grupos/list.php";
const API_GRUPO_ALL = API_URL + "grupo/all.php";
const API_GRUPO_STORE = API_URL + "grupo/store.php";
const API_GRUPO_EDIT = API_URL + "grupo/edit-form.php";
const API_GRUPO_UPDATE = API_URL + "grupo/update.php";
const API_GRUPO_DELETE = API_URL + "grupo/delete.php";
const API_GRUPO_DETAILS = API_URL + "grupo/details.php";

const API_ASISTENCIAS_JUSTIFY_FORM = API_URL + "grupo/asistencias/justify-form.php";
const API_ASISTENCIAS_JUSTIFY = API_URL + "grupo/asistencias/justify.php";
const API_ASISTENCIAS_LIST = API_URL + "grupo/asistencias/list.php";

const API_CLASES_LIST = API_URL + "grupo/clases/list.php";
const API_CLASES_FORM = API_URL + "grupo/clases/edit-form.php";
const API_CLASES_UPDATE = API_URL + "grupo/clases/update.php";
const API_CLASES_CANCEL = API_URL + "grupo/clases/cancel.php";
const API_CLASES_DELETE = API_URL + "grupo/clases/delete.php";
const API_CLASES_STORE = API_URL + "grupo/clases/store.php";

const API_ALUMNOS_LIST = API_URL + "grupo/alumnos/list.php";
const API_ALUMNOS_LISTBY = API_URL + "grupo/alumnos/list-by.php";
const API_ALUMNOS_EDIT = API_URL + "grupo/alumnos/edit-form.php";
const API_ALUMNOS_UPDATE = API_URL + "grupo/alumnos/update.php";
const API_ALUMNOS_REMOVE = API_URL + "grupo/alumnos/remove.php";
const API_ALUMNOS_STORE = API_URL + "grupo/alumnos/store.php";

// Components
let grupos;
let grupoData;

let modalGrupo;
let modalAlumno;
let modalJustificar;
let modalClaseCrear;
let modalClaseEditar;

let panelAlumnos;
let panelClases;
let panelAsistencia;

// Tables
let tableGrupos;
let tableAlumnos;
let tableClases;
let tableAsistencia;

// Tables data
let tableGruposData = [];
let tableAlumnosData = [];
let tableClasesData = [];
let tableAsistenciaData = [];

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

$(function () {
    //initialize();
});

async function initialize() {
    window.HttpClient = HttpClient;
    window.HttpException = HttpException;
    initializeComponent();
    initializeSelects();
    initializeDatesTimes();
    initializeTables();
    initializeInputs();
    initializeEvents();
    initializeAutocomplete();
    loadAll();
    clearValidation();
}

function initializeComponent() {
    grupos = new ComponentHelper("#grupos");
    grupoData = new ComponentHelper("#grupo-data");

    modalGrupo = new ComponentHelper("#modal-grupo");
    modalAlumno = new ComponentHelper("#modal-alumno");
    modalJustificar = new ComponentHelper("#modal-justificar");
    modalClaseCrear = new ComponentHelper("#modal-clase-crear");
    modalClaseEditar = new ComponentHelper("#modal-clase-editar");

    panelAlumnos = new ComponentHelper("#alumnos");
    panelClases = new ComponentHelper("#clases");
    panelAsistencia = new ComponentHelper("#asistencia");

    initializeComponentValidationFields();
    initializeComponentActions();
}

function initializeComponentValidationFields() {
    /*modalGrupo.setMandatoryFields([
        { field: "nombre", name: "Nombre", type: "input" },
        { field: "diplomado", name: "Diplomado", type: "select" },
        { field: "fecha-inicio", name: "Fecha de inicio", type: "datetimepicker" },
        { field: "hora-inicio", name: "Hora de inicio", type: "timepicker" }
    ]);

    modalAlumno.setMandatoryFields([
        { field: "nombre", name: "Nombre", type: "input" },
        { field: "apellido-1", name: "Primero apellido", type: "input" },
        { field: "correo", name: "Correo electrónico", type: "input" },
        { field: "institucion", name: "Institución", type: "input" },
    ]);

    modalJustificar.setMandatoryFields([
        { field: "alumno", name: "Alumno", type: "select" },
        { field: "clase", name: "Clase", type: "select" }
    ]);

    modalClaseEditar.setMandatoryFields([
        { field: "fecha", name: "Fecha", type: "datetimepicker" },
        { field: "hora-iniio", name: "Hora de inicio", type: "timepicker" }
    ]);

    modalClaseCrear.setMandatoryFields([
        { field: "fecha-inicio", name: "Fecha de inicio", type: "datetimepicker" },
        { field: "hora-inicio", name: "Hora de inicio", type: "timepicker" },
        { field: "cantidad", name: "Cantidad de clases", type: "input" },
        { field: "cada", name: "Cada", type: "input" },
        { field: "tiempo", name: "Tiempo", type: "select" }
    ]);*/
}

function initializeComponentActions() {
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

    panelAsistencia.onAction("justify", () => {
        formJustificar();
    });

    modalJustificar.onAction("save", async () => {
        storeJustficacion();
    });

    panelClases.onAction("add", async () => {
        modalClaseCrear.clear();

        try {
            Loader.show();

            const result = await HttpClient.post(API_DETALLES_DETAILS, { "grupo": grupoData.getField("id").val() });
            const detalle = result.data;

            modalClaseCrear.setData({
                "id": detalle.id,
                "fecha-inicio": detalle.fecha_inicio,
                "hora-inicio": detalle.hora_inicio,
                "tolerancia-antes": detalle.tolerancia_antes,
                "tolerancia-despues": detalle.tolerancia_despues
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

        modalClaseCrear.open();
    });

    modalClaseEditar.onAction("save", () => {
        updateClase();
    });

    modalClaseCrear.onAction("add", () => {
        addClases();
    });
}

function initializeSelects() {
    const options = {
        context: modalGrupo,
        triggerChange: false
    }

    SelectHelper.fill("diplomado", [], options);
}

function initializeDatesTimes() {
    DateHelper.date("fecha-inicio", { context: modalGrupo });
    DateHelper.time("hora-inicio", { context: modalGrupo, minuteIncrement: 15 });

    DateHelper.date("fecha", { context: modalClaseEditar });
    DateHelper.time("hora-inicio", { context: modalClaseEditar, minuteIncrement: 15 });

    DateHelper.date("fecha-inicio", { context: modalClaseCrear });
    DateHelper.time("hora-inicio", { context: modalClaseCrear, minuteIncrement: 15 });
}

function initializeInputs() {
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
}

function initializeEvents() {
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

function initializeTables() {
    initializeTableGrupos();
    initializeTableAlumnos();
    initializeTableClases();
}

async function loadAll() {
    try {
        Loader.show();

        const result = await HttpClient.post(API_GRUPOS_ALL, {});
        const { grupos, catalogos } = result.data;

        tableGruposData = grupos;
        TableHelper.update(tableGrupos, tableGruposData);

        SelectHelper.fill("diplomado", catalogos.diplomados, { context: modalGrupo, triggerChange: false });
        SelectHelper.fill("tiempo", catalogos.tiempo, { context: modalClaseCrear, triggerChange: false });
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

async function loadDetailsGrupo(grupo) {
    try {
        Loader.show();

        const result = await HttpClient.post(API_DETALLES_DETAILS, { "grupo": grupo });
        const detalle = result.data;

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


async function listGrupos() {
    try {
        Loader.show();

        const result = await HttpClient.post(API_GRUPOS_LIST, {});
        tableGruposData = result.data;

        TableHelper.update(tableGrupos, tableGruposData);
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
                const result = await HttpClient.post(API_GRUPO_DELETE, { "grupo": grupo });
                listGrupos();
                if (grupoData.getField("id").val() == grupo)
                    grupoData.slideUp();

                Toast.fire({
                    icon: "success",
                    title: "Grupo eliminado"
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

async function storeGrupo() {
    if (!validateFields(modalGrupo, rulesGrupo)) return;

    try {
        Loader.show();

        await HttpClient.post(API_GRUPO_STORE, modalGrupo.getData());
        listGrupos();

        modalGrupo.close();

        Toast.fire({
            icon: "success",
            title: "Grupo creado"
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

        await HttpClient.post(API_GRUPO_UPDATE, modalGrupo.getData());
        listGrupos();

        modalGrupo.close();

        if (grupoData.getField("id").val() == modalGrupo.getField("id").val())
            loadDetailsGrupo(modalGrupo.getField("id").val());

        Toast.fire({
            icon: "success",
            title: "Grupo actualizado"
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



async function listAlumnos() {
    try {
        Loader.show();

        const result = await HttpClient.post(API_ALUMNOS_LIST, { "grupo": grupoData.getField("id").val() });

        tableAlumnosData = result.data;

        TableHelper.update(tableAlumnos, tableAlumnosData);
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
                const [result, asistencias] = await Promise.all([
                    HttpClient.post(API_ALUMNOS_REMOVE, { "alumno": alumno, "grupo": grupoData.getField("id").val() }),
                    HttpClient.post(API_ASISTENCIAS_LIST, { "grupo": grupoData.getField("id").val() })
                ]);

                listAlumnos();
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

        const [result, asistencias] = await Promise.all([
            HttpClient.post(API_ALUMNOS_STORE, params),
            HttpClient.post(API_ASISTENCIAS_LIST, { "grupo": grupoData.getField("id").val() })
        ]);

        listAlumnos();
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
        const [result, asistencias] = await Promise.all([
            HttpClient.post(API_ALUMNOS_UPDATE, modalAlumno.getData()),
            HttpClient.post(API_ASISTENCIAS_LIST, { "grupo": grupoData.getField("id").val() })
        ]);

        listAlumnos();
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



async function listClases() {
    try {
        Loader.show();

        const result = await HttpClient.post(API_CLASES_LIST, { "grupo": grupoData.getField("id").val() });
        const clases = result.data;

        updateTableClases(clases);
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

                const [result, asistencias] = await Promise.all([
                    HttpClient.post(API_CLASES_CANCEL, { "clase": clase }),
                    HttpClient.post(API_ASISTENCIAS_LIST, { "grupo": grupoData.getField("id").val() })
                ]);

                listClases();
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

                const [result, asistencias] = await Promise.all([
                    HttpClient.post(API_CLASES_DELETE, { "clase": clase }),
                    HttpClient.post(API_ASISTENCIAS_LIST, { "grupo": grupoData.getField("id").val() })
                ]);

                listClases();
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

        const [result, asistencias] = await Promise.all([
            HttpClient.post(API_CLASES_STORE, modalClaseCrear.getData()),
            HttpClient.post(API_ASISTENCIAS_LIST, { "grupo": grupoData.getField("id").val() })
        ]);

        listClases();
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

        const [clase, asistencias] = await Promise.all([
            HttpClient.post(API_CLASES_UPDATE, params),
            HttpClient.post(API_ASISTENCIAS_LIST, { "grupo": grupoData.getField("id").val() })
        ]);

        listClases();
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
            columnDefs: [
                { targets: "actions:name", width: 1, orderable: false, className: "notexport" },
                { targets: "_all", className: "align-content-center dt-head-nowrap dt-head-left dt-body-left" },
                { targets: ["diplomado_nombre:name", "fecha_creacion:name"], className: "dt-body-nowrap" }
            ],
            ...TableHelper.exportButtons({
                title: "Grupos",
                filename: "grupos_" + moment(TODAY).format(formatDateExport)
            }),
            exportOptions: {
                columns: ":not(.notexport)"
            }
        }
    );
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
            columnDefs: [
                { targets: "actions:name", width: 1, orderable: false, className: "notexport" },
                { targets: "_all", className: "align-content-center dt-head-nowrap dt-head-left dt-body-left" },
                { targets: "nombre:name", className: "dt-body-nowrap" },
                { targets: "institucion:name", className: "dt-col-large" }
            ],
            ...TableHelper.exportButtons({
                title: "Alumnos",
                filename: "alumnos_" + moment(TODAY).format(formatDateExport)
            }),
            exportOptions: {
                columns: ":not(.notexport)"
            }
        }
    );
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
            columnDefs: [
                { targets: "actions:name", width: 1, orderable: false, className: "notexport" },
                { targets: "_all", className: "align-content-center dt-head-nowrap dt-head-left dt-body-left" }
            ],
            ...TableHelper.exportButtons({
                title: "Clases",
                filename: "clases_" + moment(TODAY).format(formatDateExport)
            }),
            exportOptions: {
                columns: ":not(.notexport)"
            }
        }
    );
}

function updateTableAlumnos(alumnos) {
    tableAlumnosData = alumnos;
    TableHelper.update(tableAlumnos, tableAlumnosData);
}

function updateTableClases(clases) {
    tableClasesData = clases;
    TableHelper.update(tableClases, tableClasesData);
}

function updateTableAsistencias(asistencias) {
    const { clases, alumnos, totales } = asistencias;
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